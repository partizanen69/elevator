import { LiftStatus } from "../App.types";
import { Dispatcher } from "./Dispatcher";
import { Lift } from "./Lift";
import { Direction } from "./QueueManager.types";

describe("removeFloorAlreadyTakenByOthers", () => {
  it("should set proper statuses", () => {
    const dispatcher = new Dispatcher();

    const lift0 = new Lift({
      id: 0,
      status: LiftStatus.moving,
      currentFloor: 2,
      targetFloors: [4],
      persons: [],
    });
    lift0.queueItem = {
      direction: Direction.up,
      timeRequested: new Date(),
      floorNum: 4,
    };

    const lift1 = new Lift({
      id: 1,
      status: LiftStatus.idle,
      currentFloor: 2,
      targetFloors: [],
      persons: [],
    });

    const lift2 = new Lift({
      id: 2,
      status: LiftStatus.moving,
      currentFloor: 5,
      targetFloors: [15],
      persons: [],
    });
    lift2.queueItem = {
      direction: Direction.down,
      timeRequested: new Date(),
      floorNum: 15,
    };

    const lift3 = new Lift({
      id: 3,
      status: LiftStatus.moving,
      currentFloor: 2,
      targetFloors: [12],
      persons: [],
    });
    lift3.queueItem = {
      direction: Direction.down,
      timeRequested: new Date(),
      floorNum: 12,
    };

    const lift4 = new Lift({
      id: 4,
      status: LiftStatus.moving,
      currentFloor: 3,
      targetFloors: [14],
      persons: [],
    });
    lift4.queueItem = {
      direction: Direction.down,
      timeRequested: new Date(),
      floorNum: 14,
    };

    dispatcher["lifts"] = [lift0, lift1, lift2, lift3, lift4];

    dispatcher["floors"] = {
      // persons on this floor are going down, but lift if going to take those who going up
      4: { floorNum: 4, persons: [{ goingToFloor: 1 }, { goingToFloor: 2 }] },
      // no persons left on this floor, but lift if going to take those going down
      12: { floorNum: 12, persons: [] },
      // persons on this floor are going down and lift is going to take those going down
      14: { floorNum: 14, persons: [{ goingToFloor: 13 }, { goingToFloor: 11 }] },
      // persons on this floor are going up, but lift if going to take those who going down
      15: { floorNum: 15, persons: [{ goingToFloor: 16 }] },
    };

    dispatcher["removeFloorAlreadyTakenByOthers"]();

    // the method must set lift0 to idle
    expect(lift0).toMatchObject({
      status: LiftStatus.idle,
      currentFloor: 2,
      targetFloors: [],
      queueItem: null,
    });

    // the method should not touch lift1
    expect(lift1).toMatchObject({
      id: 1,
      status: LiftStatus.idle,
      currentFloor: 2,
      targetFloors: [],
      persons: [],
    });

    // the method should set lift2 to idle
    expect(lift2).toMatchObject({
      status: LiftStatus.idle,
      currentFloor: 5,
      targetFloors: [],
      queueItem: null,
    });

    // the method should set lift2 to idle
    expect(lift3).toMatchObject({
      status: LiftStatus.idle,
      currentFloor: 2,
      targetFloors: [],
      queueItem: null,
    });

    // the method should not touch lift4
    expect(lift4).toMatchObject({
      id: 4,
      status: LiftStatus.moving,
      currentFloor: 3,
      targetFloors: [14],
      persons: [],
      queueItem: {
        direction: Direction.down,
        floorNum: 14,
      },
    });
  });
});
