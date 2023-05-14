import React from "react";
import { FLOORS } from "../App.constants";
import { Floors, LiftStatus, LiftView, Person } from "../App.types";
import { dispatcher } from "../GoGoBtn/Dispatcher";
import { queueManager } from "../GoGoBtn/QueueManager";
import { generateRandomPerson, getPersonDirection } from "../utils";

export class Emulator {
  private doneSubscribers: Set<() => void> = new Set();

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

  stopStaticEmulation(): void {
    dispatcher.stopEmulation();
    this.notifyDone();
  }

  stopDynamicEmulation(): void {
    dispatcher.stopEmulation();
    if (this.dynamicEmulationTimer) {
      clearInterval(this.dynamicEmulationTimer);
      this.dynamicEmulationTimer = null;
    }
    this.notifyDone();
  }

  isRunning(): boolean {
    return dispatcher.isRunning() || Boolean(this.dynamicEmulationTimer);
  }

  startStaticEmulation() {
    dispatcher.start();
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

    dispatcher.start();
    this.emulateNewPersonAfterTimeout();
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
        this.stopDynamicEmulation();
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

  addDoneSubscriber(cb: () => void) {
    this.doneSubscribers.add(cb);
    console.log(
      `${Emulator.name} added new done subscriber. Total subscribers: ${this.doneSubscribers.size}`
    );
  }
  removeDoneSubscriber(cb: () => void) {
    this.doneSubscribers.delete(cb);
    console.log(
      `${Emulator.name} removed done subscriber. Total subscribers: ${this.doneSubscribers.size}`
    );
  }
  notifyDone() {
    for (const sub of this.doneSubscribers) {
      sub();
    }
  }
}

export const emulator = new Emulator();
