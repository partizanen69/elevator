import { Direction } from "./GoGoBtn/QueueManager.types";
import { getPersonDirection } from "./utils";

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
