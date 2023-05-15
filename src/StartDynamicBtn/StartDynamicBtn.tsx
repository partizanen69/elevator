import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { Floors, LiftView } from "../App.types";
import { emulator } from "../core/Emulator";
import { mediator } from "../core/Mediator";
import { Topic } from "../core/Mediator.types";

type GoDynamicBtnProps = {
  lifts: LiftView[];
  setLifts: React.Dispatch<React.SetStateAction<LiftView[]>>;
  floors: Floors;
  setFloors: React.Dispatch<React.SetStateAction<Floors>>;
};

export const GoDynamicBtn: FC<GoDynamicBtnProps> = ({ lifts, setLifts }) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const reactToEmulatorStop = () => {
      setDisabled(false);
    };
    mediator.subscribe(Topic.EmulatorStop, reactToEmulatorStop);

    const reactToEmulatorStart = () => {
      setDisabled(true);
    };
    mediator.subscribe(Topic.EmulatorStart, reactToEmulatorStart);

    return () => {
      mediator.unsubscribe(Topic.EmulatorStop, reactToEmulatorStop);
      mediator.unsubscribe(Topic.EmulatorStart, reactToEmulatorStart);
    };
  }, []);

  return (
    <Button
      title="Emulate with all elevators empty on the ground floor and new random person added every 5 sec"
      onClick={() => {
        emulator.startDynamicEmulation({ lifts, setLifts });
      }}
      disabled={disabled}
    >
      Start dynamic emulation
    </Button>
  );
};
