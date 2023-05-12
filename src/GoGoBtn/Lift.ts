import { MAX_PERSONS_PER_LIFT } from "../App.constants";
import { LiftStatus, LiftView, Person } from "../App.types";
import { Direction } from "./QueueManager.types";

export class Lift implements LiftView {
  id: number;
  status: LiftStatus;
  currentFloor: number;
  targetFloors: number[];
  persons: Person[];

  private doingStuffOnTheFloor = false;

  constructor({ id, status, currentFloor, targetFloors, persons }: LiftView) {
    this.id = id;
    this.status = status;
    this.currentFloor = currentFloor;
    this.targetFloors = targetFloors;
    this.persons = persons;
  }

  private getDirection(): Direction {
    if (this.targetFloors[1] === undefined) {
      throw new Error("Lift must be idle");
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

    if (this.currentFloor < this.targetFloors[0]) {
      // it means, elevator going up, so sort ascending
      this.targetFloors.sort((a, b) => a - b);
    } else {
      // it means, elevator going down, so sort descending
      this.targetFloors.sort((a, b) => b - a);
    }
  }

  move(): void {
    // if elevator is doing stuff on the floor i.e. loads or unloads passengers, it skips one step
    if (this.doingStuffOnTheFloor) {
      this.doingStuffOnTheFloor = false;
      if (this.targetFloors[0] === this.currentFloor && !this.persons.length) {
        this.status = LiftStatus.idle;
      }
      return;
    }

    if (!this.targetFloors.length) {
      throw new Error(`Lift can't move`);
    }

    const modifier = this.currentFloor > this.targetFloors[0] ? -1 : +1;
    this.currentFloor += modifier;
  }

  loadPassengers(personsOnTheFloor: Person[]): Person[] {
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

    return personsOnTheFloor;
  }

  unloadPassengers(): void {
    this.setDoingStuffOnTheFloor();
    const initialPersons = this.persons.length;
    this.persons = this.persons.filter((person) => person.goingToFloor === this.currentFloor);
    console.log(`Lift ${this.id} unloaded ${initialPersons - this.persons.length}`);
  }
}
