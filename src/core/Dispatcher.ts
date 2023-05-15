import React from "react";
import { tickTimeMs } from "../App.constants";
import { Floors, LiftStatus, LiftView } from "../App.types";
import { sleep } from "../utils";
import { HasQueueItem, Lift } from "./Lift";
import { queueManager } from "./QueueManager";
import { Direction } from "./QueueManager.types";

export class Dispatcher {
  private timer: ReturnType<typeof setTimeout> | null = null;

  private lifts: Lift[] = [];
  // It would be nice to add mediator instead of setState func
  private setLifts!: React.Dispatch<React.SetStateAction<LiftView[]>>;

  private floors: Floors = {};
  // It would be nice to add mediator instead of setState func
  private setFloors!: React.Dispatch<React.SetStateAction<Floors>>;

  private stopSubscribers: Set<() => void> = new Set();

  constructor() {
    console.log(`Initialize ${Dispatcher.name}`);
  }

  consumeLiftsStateChanged(
    lifts: LiftView[],
    setLifts: React.Dispatch<React.SetStateAction<LiftView[]>>
  ): void {
    if (this.isRunning()) {
      return;
    }

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
    this.floors = {};
    for (const floor of Object.values(floors)) {
      this.floors[floor.floorNum] = {
        ...floor,
        persons: [...floor.persons],
      };
    }
    this.setFloors = setFloors;
  }

  private updateLiftsState() {
    const newLiftViews: LiftView[] = this.lifts.map((lift) => {
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

  start(stopCb: () => void): boolean {
    if (!queueManager.size) {
      window.alert("There is nobody in queue");
      return false;
    }

    if (this.isRunning()) {
      window.alert("Emulation is already running");
      return false;
    }

    this.stopSubscribers.add(stopCb);
    this.startTick();
    return true;
  }

  private startTick(): void {
    this.timer = setTimeout(() => this.tick(), tickTimeMs);
  }

  private stop(): void {
    for (const stopCb of Array.from(this.stopSubscribers)) {
      stopCb();
    }
    this.stopSubscribers = new Set();

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    // check if queue item is still waiting on the floor and not taken by another passing elevator
    this.removeFloorAlreadyTakenByOthers();

    this.setIdleToMoving();
    this.unloadPassengers();
    this.takePassengers();
    this.moveAll();

    this.updateLiftsState();
    this.setFloors(this.floors);
    await sleep(0);

    // if all lifts are idle and there is nobody in the queue
    if (this.allIdle && !queueManager.size) {
      console.log("Queue is empty. Complete emulation");
      this.stop();
    } else {
      console.log(`We are going to start new tick`);
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

  private getLiftsToTakePassengers(floors: Floors): Lift[] {
    // lift does not take passengers until it reaches the destination of the first run
    return this.lifts.filter((lift) => {
      const isDestinationOfFirstRun: boolean =
        Boolean(lift.queueItem) && lift.queueItem?.floorNum === lift.currentFloor;

      const somePassengerReachedTarget: boolean =
        !lift.isFinalDestination() && !lift.queueItem && lift.currentFloor === lift.targetFloors[0];

      const liftIsPassingFloorWithPassengersAndHasCapacity: boolean =
        !lift.isFinalDestination() && !lift.queueItem && lift.willingToTakePassengers(floors);

      return (
        isDestinationOfFirstRun ||
        somePassengerReachedTarget ||
        liftIsPassingFloorWithPassengersAndHasCapacity
      );
    });
  }

  private getLiftsToUnloadPassengers(): Lift[] {
    return this.lifts.filter((lift) => lift.currentFloor === lift.targetFloors[0]);
  }

  private setIdleToMoving(): void {
    const idleLifts = this.getIdleLifts();
    if (!Object.keys(idleLifts).length) {
      console.log("There is no idle lifts at the moment");
      return;
    }

    if (queueManager.size === 0) {
      console.log(`There is no items in the queue at the moment`);
      return;
    }

    let queueItem = queueManager.shift();
    while (queueItem && Object.keys(idleLifts).length) {
      const closestLift = this.findClosest(queueItem.floorNum, idleLifts);

      closestLift.status = LiftStatus.moving;
      closestLift.addTargetFloor(queueItem.floorNum);
      closestLift.queueItem = queueItem;

      console.log(
        `Queue item from floor ${queueItem.floorNum} going ${queueItem.direction} selected elevator ${closestLift.id}`
      );
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
    const lifts = this.getLiftsToTakePassengers(this.floors);
    if (!lifts.length) {
      console.log("No single elevator wants to take passengers");
      return;
    }

    for (const lift of lifts) {
      lift.setDoingStuffOnTheFloor();
      const { personsOnTheFloor, allPassengersLoaded } = lift.loadPassengers(
        this.floors[lift.currentFloor].persons
      );
      this.floors[lift.currentFloor].persons = personsOnTheFloor;
      if (!allPassengersLoaded) {
        queueManager.addInQueue(lift.currentFloor, lift.getDirection());
      }
    }
  }

  private unloadPassengers() {
    const lifts = this.getLiftsToUnloadPassengers();
    if (!lifts.length) {
      console.log("No single lift wants to unload passengers");
      return;
    }

    for (const lift of lifts) {
      lift.unloadPassengers();
    }
  }

  private moveAll(): void {
    for (const lift of this.lifts) {
      if (lift.status !== LiftStatus.idle) {
        lift.move();
      }
    }
  }

  // There is a situation when another elevator has taken persons from the floor
  // because it was passing that floor and stopped there to unload other passengers
  // and it was moving to the same direction so it took passengers waiting on that floor.
  // Hence, this floor is not valid for other elevator anymore. We put it to idle so other queue item can pick it up
  private removeFloorAlreadyTakenByOthers(): void {
    const liftsGoingToTheFirstTarget = this.lifts.filter((lift): lift is Lift & HasQueueItem =>
      Boolean(lift.queueItem)
    );

    for (const lift of liftsGoingToTheFirstTarget) {
      lift.queueItem.floorNum;
      lift.queueItem.direction;

      const personsWaitingForThisLift = this.floors[lift.queueItem.floorNum].persons.filter(
        (person) => {
          if (
            person.goingToFloor > lift.queueItem.floorNum &&
            lift.queueItem.direction === Direction.up
          ) {
            return true;
          } else if (
            person.goingToFloor < lift.queueItem.floorNum &&
            lift.queueItem.direction === Direction.down
          ) {
            return true;
          } else {
            return false;
          }
        }
      );

      if (!personsWaitingForThisLift.length) {
        lift.status = LiftStatus.idle;
        lift.targetFloors = [];
        (lift as Lift).queueItem = null;
      }
    }
  }
}

export const dispatcher = new Dispatcher();
