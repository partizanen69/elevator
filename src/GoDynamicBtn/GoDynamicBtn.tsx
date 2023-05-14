import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { Floors, LiftView } from "../App.types";
import { emulator } from "../Emulator/Emulator";

type GoDynamicBtnProps = {
  lifts: LiftView[];
  setLifts: React.Dispatch<React.SetStateAction<LiftView[]>>;
  floors: Floors;
  setFloors: React.Dispatch<React.SetStateAction<Floors>>;
};

export const GoDynamicBtn: FC<GoDynamicBtnProps> = ({ lifts, setLifts }) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const cb = () => {
      setDisabled(false);
    };
    emulator.addDoneSubscriber(cb);
    return () => {
      emulator.removeDoneSubscriber(cb);
    };
  }, []);

  return (
    <Button
      title="Emulate with all elevators empty on the ground floor and new random person added every 5 sec"
      onClick={() => {
        setDisabled(true);
        emulator.startDynamicEmulation({ lifts, setLifts });
      }}
      disabled={disabled}
    >
      Start dynamic emulation
    </Button>
  );
};
