import { QueueManager } from "./QueueManager";
import { Direction } from "./QueueManager.types";

describe("handlePersonRemovedFromTheFloor", () => {
  it("should remove queue item if persons going up were removed", () => {
    const queueManager = new QueueManager();
    queueManager.addInQueue(2, Direction.up);
    queueManager.addInQueue(2, Direction.down);
    queueManager.addInQueue(8, Direction.down);

    queueManager.handlePersonRemovedFromTheFloor(2, [{ goingToFloor: 1 }]);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.up && q.floorNum === 2)
    ).toBe(undefined);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.down && q.floorNum === 2)
    ).toBeTruthy();
  });

  it("should remove queue item if person going down were removed", () => {
    const queueManager = new QueueManager();
    queueManager.addInQueue(2, Direction.up);
    queueManager.addInQueue(2, Direction.down);
    queueManager.addInQueue(8, Direction.down);

    queueManager.handlePersonRemovedFromTheFloor(2, [{ goingToFloor: 3 }]);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.down && q.floorNum === 2)
    ).toBe(undefined);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.up && q.floorNum === 2)
    ).toBeTruthy();
  });

  // this is hypothetical case but still good to be tested
  it("should remove queue items if no persons left on the floor", () => {
    const queueManager = new QueueManager();
    queueManager.addInQueue(2, Direction.up);
    queueManager.addInQueue(2, Direction.down);
    queueManager.addInQueue(8, Direction.down);

    queueManager.handlePersonRemovedFromTheFloor(2, []);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.down && q.floorNum === 2)
    ).toBe(undefined);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.up && q.floorNum === 2)
    ).toBe(undefined);
  });

  it("should not touch queue, since persons remaining on the floor", () => {
    const queueManager = new QueueManager();
    queueManager.addInQueue(2, Direction.up);
    queueManager.addInQueue(2, Direction.down);
    queueManager.addInQueue(8, Direction.down);

    queueManager.handlePersonRemovedFromTheFloor(2, [{ goingToFloor: 1 }, { goingToFloor: 3 }]);
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.down && q.floorNum === 2)
    ).toBeTruthy();
    expect(
      queueManager["queue"].find((q) => q.direction === Direction.up && q.floorNum === 2)
    ).toBeTruthy();
  });
});
