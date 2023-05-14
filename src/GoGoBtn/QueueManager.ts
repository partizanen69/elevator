import { Person } from "../App.types";
import { Direction, QueueItem } from "./QueueManager.types";

export class QueueManager {
  private queue: QueueItem[] = [];

  constructor() {
    console.log(`Initialize ${QueueManager.name}`);
  }

  get size(): number {
    return this.queue.length;
  }

  addInQueue(floorNum: number, direction: Direction): void {
    const idx = this.queue.findIndex(
      (item) => item.floorNum === floorNum && item.direction === direction
    );
    if (idx > -1) {
      console.log(
        `Floor ${floorNum} going ${direction} is already in the queue. Continue waiting...`
      );
    } else {
      console.log(
        `Adding floor ${floorNum} going ${direction} to the queue. Current queue size is ${this.queue.length}`
      );
      this.queue.push({
        floorNum,
        direction,
        timeRequested: new Date(),
      });
    }
  }

  shift(): QueueItem | undefined {
    return this.queue.shift();
  }

  handlePersonRemovedFromTheFloor(floorNum: number, newPersons: Person[]): void {
    const personsGoingUp = newPersons.filter((person) => person.goingToFloor > floorNum);
    const personsGoingDown = newPersons.filter((person) => person.goingToFloor < floorNum);

    if (!personsGoingUp.length) {
      const idxToDelete = this.queue.findIndex(
        (queueItem) => queueItem.direction === Direction.up && queueItem.floorNum === floorNum
      );
      if (idxToDelete > -1) {
        this.queue.splice(idxToDelete, 1);
      }
    }

    if (!personsGoingDown.length) {
      const idxToDelete = this.queue.findIndex(
        (queueItem) => queueItem.direction === Direction.down && queueItem.floorNum === floorNum
      );
      if (idxToDelete > -1) {
        this.queue.splice(idxToDelete, 1);
      }
    }
  }

  addBunchOfPersonsToTheQueue(floorNum: number, persons: Person[]): void {
    let up = false;
    let down = false;

    for (const person of persons) {
      if (person.goingToFloor > floorNum && !up) {
        up = true;
      }
      if (person.goingToFloor < floorNum && !down) {
        down = true;
      }
    }

    if (up) {
      this.addInQueue(floorNum, Direction.up);
    }
    if (down) {
      this.addInQueue(floorNum, Direction.down);
    }
  }
}

export const queueManager = new QueueManager();
