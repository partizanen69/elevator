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
}

export const queueManager = new QueueManager();
