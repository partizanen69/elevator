import React from "react";
import { MAX_PERSONS_PER_LIFT, tickTimeMs } from "../App.constants";
import { Floors, LiftStatus, LiftView } from "../App.types";
import { Lift } from "./Lift";
import { queueManager } from "./QueueManager";

class Dispatcher {
  private timer: ReturnType<typeof setTimeout> | null = null;

  // TODO: think if I really need an object here
  private lifts: Lift[] = [];
  private setLifts!: React.Dispatch<React.SetStateAction<LiftView[]>>;

  private floors: Floors = {};
  private setFloors!: React.Dispatch<React.SetStateAction<Floors>>;

  constructor() {
    console.log(`Initialize ${Dispatcher.name}`);
  }

  consumeLiftsStateChanged(
    lifts: LiftView[],
    setLifts: React.Dispatch<React.SetStateAction<LiftView[]>>
  ): void {
    console.log("Dispatcher consumed lifts changed");
    this.lifts = [];

    for (const liftView of lifts) {
      this.lifts.push(
        new Lift({
          ...liftView,
          persons: [...liftView.persons],
        })
      );
    }

    this.setLifts = setLifts;
  }

  consumeFloorsChanged(floors: Floors, setFloors: React.Dispatch<React.SetStateAction<Floors>>) {
    console.log(`Dispatcher consumed floors changed`);
    for (const floor of Object.values(floors)) {
      this.floors[floor.floorNum] = {
        ...floor,
        persons: [...floor.persons],
      };
    }
    this.setFloors = setFloors;
  }

  private updateLiftsState() {
    const newLiftViews = this.lifts.map((lift) => {
      return {
        id: lift.id,
        status: lift.status,
        currentFloor: lift.currentFloor,
        targetFloors: lift.targetFloors,
        persons: lift.persons,
      };
    });
    this.setLifts(newLiftViews);
  }

  isRunning(): boolean {
    return Boolean(this.timer);
  }

  startEmulation(): void {
    if (!queueManager.size) {
      window.alert("There is nobody in queue");
      return;
    }
    this.startTick();
  }

  private startTick(): void {
    this.timer = setTimeout(() => this.tick(), tickTimeMs);
  }

  // TODO: think if it is private
  stopEmulation(): void {
    if (this.timer === null) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }

  private tick(): void {
    console.log(`Start tick. Queue size is ${queueManager.size}`);

    this.setIdleToMoving();
    this.unloadPassengers();
    this.takePassengers();

    for (const lift of this.lifts) {
      if (lift.status === LiftStatus.moving) {
        lift.move();
      }
    }
    this.updateLiftsState();
    this.setFloors(this.floors);

    // if all lifts are idle and there is nobody in the queue
    if (this.allIdle && !queueManager.size) {
      console.log("Queue is empty. Complete emulation");
      this.stopEmulation();
    } else {
      this.startTick();
    }
  }

  private getIdleLifts(): Record<string, Lift> {
    const result: Record<string, Lift> = {};

    for (const lift of this.lifts) {
      if (lift.status === LiftStatus.idle) {
        result[lift.id] = lift;
      }
    }
    return result;
  }

  private getLiftsToTakePassengers(): Lift[] {
    return this.lifts.filter(
      (lift) =>
        lift.currentFloor === lift.targetFloors[0] && lift.persons.length < MAX_PERSONS_PER_LIFT
    );
  }

  private getLiftsToUnloadPassengers(): Lift[] {
    return this.lifts.filter((lift) => lift.currentFloor === lift.targetFloors[0]);
  }

  private setIdleToMoving(): void {
    const idleLifts = this.getIdleLifts();
    if (!Object.keys(idleLifts).length) {
      console.log("There is no idle lifts now");
      return;
    }

    let queueItem = queueManager.shift();
    while (queueItem && Object.keys(idleLifts).length) {
      const closestLift = this.findClosest(queueItem.floorNum, idleLifts);

      closestLift.status = LiftStatus.moving;
      closestLift.addTargetFloor(queueItem.floorNum);

      delete idleLifts[closestLift.id];
      if (Object.keys(idleLifts).length) {
        queueItem = queueManager.shift();
      }
    }
  }

  private findClosest(floorNum: number, idleLifts: Record<string, Lift>): Lift {
    const idleLiftsArr = Object.values(idleLifts);

    const closest = {
      lift: idleLiftsArr[0],
      distance: Math.abs(floorNum - idleLiftsArr[0].currentFloor),
    };

    for (let i = 1; i < idleLiftsArr.length; i++) {
      const idleLift = idleLiftsArr[i];
      const currentDistance = Math.abs(idleLift.currentFloor - floorNum);
      if (currentDistance < closest.distance) {
        closest.lift = idleLift;
        closest.distance = currentDistance;
      }
    }

    return closest.lift;
  }

  get allIdle(): boolean {
    return this.lifts.every((lift) => lift.status === LiftStatus.idle);
  }

  private takePassengers() {
    const lifts = this.getLiftsToTakePassengers();
    if (!lifts.length) {
      console.log("There is no lift to do stuff on the floor");
      return;
    }

    for (const lift of lifts) {
      lift.setDoingStuffOnTheFloor();
      this.floors[lift.currentFloor].persons = lift.loadPassengers(
        this.floors[lift.currentFloor].persons
      );
    }
  }

  private unloadPassengers() {
    const lifts = this.getLiftsToUnloadPassengers();
    if (!lifts.length) {
      console.log("There is no lift to unload passengers on the floor");
      return;
    }

    for (const lift of lifts) {
      lift.unloadPassengers();
    }
  }
}

export const dispatcher = new Dispatcher();
