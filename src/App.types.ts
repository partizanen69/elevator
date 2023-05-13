export enum LiftStatus {
  moving = "moving",
  idle = "idle",
}

export interface LiftView {
  id: number;
  status: LiftStatus;
  currentFloor: number;
  targetFloors: number[];
  persons: Person[];
}

export type Person = {
  goingToFloor: number;
};

export type Floor = {
  floorNum: number;
  persons: Person[];
  // personsUp: Person[];
  // personsDown: Person[];
};

export type Floors = {
  [key in number]: Floor;
};
