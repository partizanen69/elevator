import { Direction } from "./core/QueueManager.types";
import { getFloorsNotCurrent, getPersonDirection } from "./utils";

describe("getPersonDirection", () => {
  it("should go up", () => {
    const direction = getPersonDirection(3, 10);
    expect(direction).toBe(Direction.up);
  });

  it("should go down", () => {
    const direction = getPersonDirection(3, 1);
    expect(direction).toBe(Direction.down);
  });
});

describe("getFloorsNotCurrent", () => {
  it("should just work", () => {
    let floors = getFloorsNotCurrent(5);
    expect(floors).toMatchObject([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    floors = getFloorsNotCurrent(1);
    expect(floors).toMatchObject([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    floors = getFloorsNotCurrent(15);
    expect(floors).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });
});
