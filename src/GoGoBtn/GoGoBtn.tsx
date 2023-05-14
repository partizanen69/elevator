import { Button } from "antd";
import { FC } from "react";
import { LiftView } from "../App.types";
import useGoGoBtn from "./useGoGoBtn";

type GoGoBtnProps = {
  setLifts: (lifts: LiftView[]) => void;
};

export const GoGoBtn: FC<GoGoBtnProps> = () => {
  const { startStaticEmulation, disabled } = useGoGoBtn();
  return (
    <Button
      disabled={disabled} // TODO: think about removing it
      onClick={startStaticEmulation}
      title="Emulate with current state and no subsequent changes"
    >
      Start static emulation
    </Button>
  );
};
