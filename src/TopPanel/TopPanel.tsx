import { Button } from "antd";
import { FC } from "react";
import { FLOORS } from "../App.constants";
import { LiftView } from "../App.types";

type TopPanelProps = {
  lifts: LiftView[];
  setLifts: React.Dispatch<React.SetStateAction<LiftView[]>>;
};

export const TopPanel: FC<TopPanelProps> = ({ lifts, setLifts }) => {
  const move = (liftId: number, modifier: -1 | 1): void => {
    const lift = lifts[liftId];
    const newFloor = lift.currentFloor + modifier;
    if (newFloor < 1 || newFloor > FLOORS) {
      return;
    }

    const newLifts = lifts.slice();
    newLifts[liftId] = { ...lift, currentFloor: newFloor, targetFloors: [] };
    setLifts(newLifts);
  };

  return (
    <div className="top-panel mb-1 flex h-12 px-40">
      {lifts.map((lift, idx) => {
        return (
          <div key={idx} className="mx-2 flex w-[90px] flex-col gap-1 text-xs">
            <Button style={buttonStyle} onClick={() => move(lift.id, 1)}>
              Up
            </Button>
            <Button style={buttonStyle} onClick={() => move(lift.id, -1)}>
              Down
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const buttonStyle = {
  padding: "0 5px",
  fontSize: "0.75rem",
};
