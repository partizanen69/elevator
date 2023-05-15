import { Button } from "antd";
import { FC } from "react";
import { LiftView } from "../App.types";
import useStartStaticBtn from "./useStartStaticBtn";

type GoGoBtnProps = {
  setLifts: (lifts: LiftView[]) => void;
};

export const GoStaticBtn: FC<GoGoBtnProps> = () => {
  const { startStaticEmulation, disabled } = useStartStaticBtn();
  return (
    <Button
      disabled={disabled}
      onClick={startStaticEmulation}
      title="Emulate with current state and no subsequent changes"
    >
      Start static emulation
    </Button>
  );
};
