import { Floors, LiftView } from "../App.types";

export type GenStateBtnProps = {
  setLifts: (lifts: LiftView[]) => void;
  setFloors: (floors: Floors) => void;
};
