import { Direction } from "./GoGoBtn/QueueManager.types";

export const getPersonDirection = (currentFloor: number, floorToGo: number): Direction => {
  return currentFloor < floorToGo ? Direction.up : Direction.down;
};
