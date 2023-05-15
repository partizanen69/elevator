import React from "react";
import { FLOORS } from "../App.constants";
import { Floors, LiftStatus, LiftView, Person } from "../App.types";
import { dispatcher } from "../core/Dispatcher";
import { queueManager } from "../core/QueueManager";
import { generateRandomPerson, getPersonDirection } from "../utils";
import { mediator } from "./Mediator";
import { Topic } from "./Mediator.types";

export class Emulator {
  private dynamicEmulationTimer: ReturnType<typeof setTimeout> | null = null;

  private floors: Floors = {};
  private setFloors!: React.Dispatch<React.SetStateAction<Floors>>;

  consumeFloorsChanged(floors: Floors, setFloors: React.Dispatch<React.SetStateAction<Floors>>) {
    console.log(`${Emulator.name} consumed floors changed`);
    this.floors = {};
    for (const floor of Object.values(floors)) {
      this.floors[floor.floorNum] = {
        ...floor,
        persons: [...floor.persons],
      };
    }
    this.setFloors = setFloors;
  }

  isRunning(): boolean {
    return dispatcher.isRunning() || Boolean(this.dynamicEmulationTimer);
  }

  startStaticEmulation() {
    const stopCallback = (): void => {
      mediator.publish(Topic.EmulatorStop);
    };

    const started = dispatcher.start(stopCallback);

    if (started) {
      mediator.publish(Topic.EmulatorStart);
    } else {
      mediator.publish(Topic.EmulatorStop);
    }
  }

  startDynamicEmulation({
    lifts,
    setLifts,
  }: {
    lifts: LiftView[];
    setLifts: React.Dispatch<React.SetStateAction<LiftView[]>>;
  }) {
    setLifts(
      lifts.map((lift) => {
        return {
          ...lift,
          status: LiftStatus.idle,
          currentFloor: 1,
          targetFloors: [],
          persons: [],
        };
      })
    );

    // let the first person be somewhere on the top floor
    const floorNum = Math.ceil(Math.random() * 5) + FLOORS - 5;
    for (const floor of Object.values(this.floors)) floor.persons = [];
    const { person } = this.addRandomPersonToRandomFloor(floorNum);

    queueManager.flushQueue();
    queueManager.addInQueue(floorNum, getPersonDirection(floorNum, person.goingToFloor));

    const started = dispatcher.start((): void => {
      mediator.publish(Topic.EmulatorStop);
    });

    if (started) {
      mediator.publish(Topic.EmulatorStart);
      this.emulateNewPersonAfterTimeout();
    } else {
      mediator.publish(Topic.EmulatorStop);
    }
  }

  addRandomPersonToRandomFloor(floorNum?: number): { person: Person; floorNum: number } {
    if (!floorNum) {
      floorNum = Math.ceil(Math.random() * FLOORS);
    }

    const person = generateRandomPerson(floorNum);

    this.floors[floorNum].persons.push(person);

    this.setFloors(this.floors);

    return { person, floorNum };
  }

  emulateNewPersonAfterTimeout() {
    this.dynamicEmulationTimer = setTimeout(() => {
      if (!dispatcher.isRunning()) {
        console.log("Dispatcher completed with all passengers. Stopping dynamic emulation");
        // this.stopDynamicEmulation();
        return;
      }

      const { person, floorNum } = this.addRandomPersonToRandomFloor();
      queueManager.addInQueue(floorNum, getPersonDirection(floorNum, person.goingToFloor));

      if (this.dynamicEmulationTimer) {
        clearTimeout(this.dynamicEmulationTimer);
        this.dynamicEmulationTimer = null;
      }

      this.emulateNewPersonAfterTimeout();
    }, 5000);
  }
}

export const emulator = new Emulator();