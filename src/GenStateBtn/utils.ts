import shuffle from "lodash/shuffle";
import { FLOORS_ARR, MAX_PERSONS_PER_FLOOR } from "../App.constants";
import { Person } from "../App.types";

export const generateRandomPersons = (floorNum: number): Person[] => {
  const persons: Person[] = [];
  const countPersons = Math.ceil(Math.random() * MAX_PERSONS_PER_FLOOR);

  const floorsNotCurrent: number[] = shuffle(getFloorsNotCurrent(floorNum));

  for (let i = 0; i < countPersons; i++) {
    const floorNotCurrentIdx = Math.floor(Math.random() * floorsNotCurrent.length);

    persons.push({
      goingToFloor: floorsNotCurrent[floorNotCurrentIdx],
    });
  }

  return persons;
};

export const getFloorsNotCurrent = (floorNum: number): number[] => {
  return [...FLOORS_ARR.slice(0, floorNum - 1), ...FLOORS_ARR.slice(floorNum)];
};
