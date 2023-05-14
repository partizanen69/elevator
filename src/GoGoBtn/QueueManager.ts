import { Person } from "../App.types";
import { Direction, QueueItem, Subscriber } from "./QueueManager.types";

export class QueueManager {
  private queue: QueueItem[] = [];
  private subscribers: Set<Subscriber> = new Set();

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
      this.queue.push({
        floorNum,
        direction,
        timeRequested: new Date(),
      });
      console.log(
        `Added floor ${floorNum} going ${direction} to the queue. Current queue size is ${this.queue.length}`
      );
    }

    this.notifySubscribers();
  }

  shift(): QueueItem | undefined {
    const item = this.queue.shift();
    this.notifySubscribers();
    console.warn(
      `Item ${item?.floorNum} going ${item?.direction} removed from the queue. Queue size ${this.queue.length}`
    );
    return item;
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
        this.notifySubscribers();
      }
    }

    if (!personsGoingDown.length) {
      const idxToDelete = this.queue.findIndex(
        (queueItem) => queueItem.direction === Direction.down && queueItem.floorNum === floorNum
      );
      if (idxToDelete > -1) {
        this.queue.splice(idxToDelete, 1);
        this.notifySubscribers();
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

    if (up || down) {
      this.notifySubscribers();
    }
  }

  flushQueue(): void {
    this.queue = [];
    this.notifySubscribers();
  }

  subscribeToQueueChange(cb: Subscriber): QueueItem[] {
    console.log(`${QueueManager.name} registered new subscriber`);
    this.subscribers.add(cb);
    return this.queue;
  }
  unsubscribeFromQueueChange(cb: Subscriber) {
    console.log(`${QueueManager.name} removed subscriber`);
    this.subscribers.delete(cb);
  }
  private notifySubscribers(): void {
    for (const subscriber of Array.from(this.subscribers)) {
      subscriber(this.queue);
    }
  }
}

export const queueManager = new QueueManager();
