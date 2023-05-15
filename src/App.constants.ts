import { Floors, LiftStatus, LiftView } from "./App.types";
import { queueManager } from "./core/QueueManager";
import { getPersonDirection } from "./utils";

export const FLOORS = 15;

export const LIFTS_PER_FLOOR = 4;

export const MAX_PERSONS_PER_FLOOR = 10;

export const MAX_PERSONS_PER_LIFT = 4;

// time for one step e.g. how long it will take for an elevator to pass one floor,
// or how long it will take to unload passengers at destination floor
export const tickTimeMs = 1000;

export const INITIAL_LIFT_POSITIONS: LiftView[] = new Array(LIFTS_PER_FLOOR)
  .fill(null)
  .map((_, idx): LiftView => {
    return {
      id: idx,
      status: LiftStatus.idle,
      currentFloor: 1,
      targetFloors: [],
      persons: [],
    };
  });

export const FLOORS_ARR: readonly number[] = new Array(FLOORS).fill(null).map((_, idx) => idx + 1);

export const INITIAL_FLOORS = FLOORS_ARR.reduce<Floors>(
  (acc, floorNum) => {
    if (acc[floorNum]) {
      return acc;
    }
    acc[floorNum] = { floorNum, persons: [] };
    return acc;
  },
  {
    3: {
      floorNum: 3,
      persons: [{ goingToFloor: 10 }, { goingToFloor: 8 }, { goingToFloor: 2 }],
    },
    7: {
      floorNum: 7,
      persons: [{ goingToFloor: 1 }, { goingToFloor: 15 }],
    },
    15: {
      floorNum: 15,
      persons: [{ goingToFloor: 1 }, { goingToFloor: 2 }],
    },
  }
);
for (const floor of Object.values(INITIAL_FLOORS)) {
  for (const person of floor.persons) {
    queueManager.addInQueue(
      floor.floorNum,
      getPersonDirection(floor.floorNum, person.goingToFloor)
    );
  }
}

export const EMULATION_RUNNING_MSG = "There is existing emulation running";
