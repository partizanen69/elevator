import { LiftStatus } from "../App.types";
import { Lift } from "./Lift";

describe("checkIfAllPassengersLoaded", () => {
  it("should return true if no persons remaining on the floor", () => {
    const lift = new Lift({
      id: 1,
      status: LiftStatus.moving,
      currentFloor: 4,
      targetFloors: [5, 7],
      persons: [], // it does not matter for this test
    });

    let result = lift["checkIfAllPassengersLoaded"]([{ goingToFloor: 1 }]);
    expect(result).toBe(true);

    result = lift["checkIfAllPassengersLoaded"]([]);
    expect(result).toBe(true);
  });
  it("should return false if some person still remaining on the floor", () => {
    const lift = new Lift({
      id: 1,
      status: LiftStatus.moving,
      currentFloor: 4,
      targetFloors: [5, 7],
      persons: [], // it does not matter for this test
    });

    const result = lift["checkIfAllPassengersLoaded"]([{ goingToFloor: 5 }, { goingToFloor: 1 }]);
    expect(result).toBe(false);
  });
});
