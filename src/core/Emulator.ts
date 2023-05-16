import React from "react";
import { FLOORS, TIMEOUT_ADD_NEW_PERSON } from "../App.constants";
import { Floors, LiftStatus, LiftView, Person } from "../App.types";
import { dispatcher } from "../core/Dispatcher";
import { queueManager } from "../core/QueueManager";
import { generateRandomPerson, getPersonDirection, sleep } from "../utils";
import { mediator } from "./Mediator";
import { Topic } from "./Mediator.types";

export class Emulator {
  private timer: ReturnType<typeof setTimeout> | null = null;

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
    return dispatcher.isRunning() || Boolean(this.timer);
  }

  startStaticEmulation() {
    const started = dispatcher.start((): void => {
      this.stopEmulation();
    });

    if (started) {
      mediator.publish(Topic.EmulatorStart);
    } else {
      mediator.publish(Topic.EmulatorStop);
    }
  }

  async startDynamicEmulation({
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
    await sleep(0); // wait for the state to change

    // let the first person be somewhere on the top floor
    const floorNum = Math.ceil(Math.random() * 5) + FLOORS - 5;
    for (const floor of Object.values(this.floors)) floor.persons = [];
    const { person } = await this.addRandomPersonToRandomFloor(floorNum);

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

  async addRandomPersonToRandomFloor(
    floorNum?: number
  ): Promise<{ person: Person; floorNum: number }> {
    if (!floorNum) {
      floorNum = Math.ceil(Math.random() * FLOORS);
    }

    const person = generateRandomPerson(floorNum);

    this.floors[floorNum].persons.push(person);

    this.setFloors(this.floors);
    await sleep(0); // wait for the state to change

    return { person, floorNum };
  }

  emulateNewPersonAfterTimeout() {
    this.timer = setTimeout(async () => {
      // TODO: do something with this
      if (!dispatcher.isRunning()) {
        console.log("Dispatcher completed with all passengers. Stopping dynamic emulation");
        // this.stopDynamicEmulation();
        return;
      }

      const { person, floorNum } = await this.addRandomPersonToRandomFloor();
      queueManager.addInQueue(floorNum, getPersonDirection(floorNum, person.goingToFloor));

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.emulateNewPersonAfterTimeout();
    }, TIMEOUT_ADD_NEW_PERSON);
  }

  private stopEmulation() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    mediator.publish(Topic.EmulatorStop);
  }
}

export const emulator = new Emulator();
