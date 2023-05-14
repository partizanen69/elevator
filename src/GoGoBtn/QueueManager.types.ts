export type QueueItem = {
  direction: Direction;
  timeRequested: Date;
  floorNum: number;
};

export enum Direction {
  up = "up",
  down = "down",
}

export type Subscriber = (q: QueueItem[]) => void;
