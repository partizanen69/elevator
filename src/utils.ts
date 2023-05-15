import { shuffle } from "lodash";
import { FLOORS_ARR, MAX_PERSONS_PER_FLOOR } from "./App.constants";
import { Person } from "./App.types";
import { Direction } from "./core/QueueManager.types";

export const getPersonDirection = (currentFloor: number, floorToGo: number): Direction => {
  return currentFloor < floorToGo ? Direction.up : Direction.down;
};

export const generateRandomPersons = (floorNum: number): Person[] => {
  const persons: Person[] = [];
  const countPersons = Math.ceil(Math.random() * MAX_PERSONS_PER_FLOOR);

  const floorsNotCurrent: number[] = shuffle(getFloorsNotCurrent(floorNum));

  for (let i = 0; i < countPersons; i++) {
    persons.push(generateRandomPerson(floorNum, floorsNotCurrent));
  }

  return persons;
};

export const getFloorsNotCurrent = (floorNum: number): number[] => {
  return [...FLOORS_ARR.slice(0, floorNum - 1), ...FLOORS_ARR.slice(floorNum)];
};

export const generateRandomPerson = (floorNum: number, floorsNotCurrent?: number[]): Person => {
  if (!floorsNotCurrent) {
    floorsNotCurrent = shuffle(getFloorsNotCurrent(floorNum));
  }

  const floorNotCurrentIdx = Math.floor(Math.random() * floorsNotCurrent.length);

  return { goingToFloor: floorsNotCurrent[floorNotCurrentIdx] };
};
