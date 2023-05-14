import { getFloorsNotCurrent } from "./utils";

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
