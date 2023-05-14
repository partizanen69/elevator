import { MAX_PERSONS_PER_LIFT } from "../App.constants";
import { Floors, LiftStatus, LiftView, Person } from "../App.types";
import { Direction, QueueItem } from "./QueueManager.types";

export interface HasQueueItem {
  queueItem: QueueItem;
}

export class Lift implements LiftView {
  id: number;
  status: LiftStatus;
  currentFloor: number;
  targetFloors: number[];
  persons: Person[];

  // lift holds queueitem until it reaches the QueueItem.floorNum
  // after it takes the passengers, it is null
  queueItem: QueueItem | null = null;

  private doingStuffOnTheFloor = false;

  constructor({ id, status, currentFloor, targetFloors, persons }: LiftView) {
    this.id = id;
    this.status = status;
    this.currentFloor = currentFloor;
    this.targetFloors = targetFloors;
    this.persons = persons;
  }

  isFinalDestination(): boolean {
    return this.targetFloors[1] === undefined && !this.queueItem;
  }

  getDirection(): Direction {
    if (this.queueItem && this.queueItem.floorNum === this.currentFloor) {
      return this.queueItem.direction;
    }

    if (this.queueItem && this.queueItem.floorNum !== this.currentFloor) {
      return this.queueItem.floorNum > this.currentFloor ? Direction.up : Direction.down;
    }

    return this.currentFloor > this.targetFloors[1] ? Direction.down : Direction.up;
  }

  private getPersonDirection(person: Person): Direction {
    return person.goingToFloor > this.currentFloor ? Direction.up : Direction.down;
  }

  setDoingStuffOnTheFloor(): void {
    this.doingStuffOnTheFloor = true;
  }

  // TODO: think about something more efficient
  addTargetFloor(floorNum: number | number[]) {
    if (!Array.isArray(floorNum)) {
      floorNum = [floorNum];
    }

    this.targetFloors = this.targetFloors.concat(floorNum);

    if (this.getDirection() === Direction.up) {
      this.targetFloors = this.targetFloors
        .slice(0, 1)
        .concat(this.targetFloors.slice(1).sort((a, b) => a - b));
    } else {
      // it means, elevator going down, so sort descending
      this.targetFloors = this.targetFloors
        .slice(0, 1)
        .concat(this.targetFloors.slice(1).sort((a, b) => b - a));
    }
  }

  move(): void {
    if (this.targetFloors[0] === this.currentFloor) {
      // remove current target floor from the list since the lift has already visited it
      this.targetFloors.shift();
    }

    // if elevator is doing stuff on the floor i.e. loads or unloads passengers, it skips one step
    if (this.doingStuffOnTheFloor) {
      this.doingStuffOnTheFloor = false;
      if (!this.targetFloors.length && !this.persons.length) {
        this.status = LiftStatus.idle;
      }
      return;
    }

    if (!this.targetFloors.length) {
      throw new Error(`Lift ${this.id} can't move`);
    }

    const modifier = this.currentFloor > this.targetFloors[0] ? -1 : +1;
    this.currentFloor += modifier;
  }

  loadPassengers(personsOnTheFloor: Person[]): {
    personsOnTheFloor: Person[];
    allPassengersLoaded: boolean;
  } {
    const liftDirection = this.getDirection();

    for (let i = personsOnTheFloor.length - 1; i >= 0; i--) {
      const person = personsOnTheFloor[i];
      if (liftDirection === this.getPersonDirection(person)) {
        this.persons.push(person);
        this.addTargetFloor(person.goingToFloor);
        personsOnTheFloor.splice(i, 1);
      }

      if (this.persons.length >= MAX_PERSONS_PER_LIFT) {
        break;
      }
    }

    if (this.currentFloor === this.queueItem?.floorNum) {
      this.queueItem = null;
    }

    const allPassengersLoaded: boolean = this.checkIfAllPassengersLoaded(personsOnTheFloor);

    return { personsOnTheFloor, allPassengersLoaded };
  }

  unloadPassengers(): void {
    this.setDoingStuffOnTheFloor();

    const initialPersons = this.persons.length;
    this.persons = this.persons.filter((person) => person.goingToFloor !== this.currentFloor);

    if (initialPersons > this.persons.length) {
      console.log(`Lift ${this.id} unloaded ${initialPersons - this.persons.length}`);
    }
  }

  private checkIfAllPassengersLoaded(personsOnTheFloor: Person[]): boolean {
    const liftDirection = this.getDirection();

    const allPassengersLoaded: boolean = personsOnTheFloor.reduce<boolean>((acc, person) => {
      if (this.getPersonDirection(person) === liftDirection) {
        acc = false;
      }
      return acc;
    }, true);

    return allPassengersLoaded;
  }

  hasCapacity(): boolean {
    return this.persons.length < MAX_PERSONS_PER_LIFT;
  }

  willingToTakePassengers(floors: Floors): boolean {
    const liftDirection = this.getDirection();

    const passengersPassengersGoingSameDirection = floors[this.currentFloor].persons.some(
      (person) => this.getPersonDirection(person) === liftDirection
    );

    return this.hasCapacity() && passengersPassengersGoingSameDirection;
  }
}
