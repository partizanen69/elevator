import { Button } from "antd";
import { FC } from "react";
import { Floors, LiftView } from "../App.types";
import { queueManager } from "../core/QueueManager";
import useGenStateBtn from "./hooks/useGenStateBtn";

type GenStateBtnProps = {
  setLifts: (lifts: LiftView[]) => void;
  setFloors: (floors: Floors) => void;
};

export const GenStateBtn: FC<GenStateBtnProps> = ({ setLifts, setFloors }) => {
  const { generateRandomLifts, generateRandomFloors } = useGenStateBtn();

  return (
    <Button
      onClick={() => {
        queueManager.flushQueue();
        setLifts(generateRandomLifts());
        setFloors(generateRandomFloors());
      }}
    >
      Generate random state
    </Button>
  );
};
