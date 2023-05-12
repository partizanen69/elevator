import { Button } from "antd";
import { FC } from "react";
import { LiftView } from "../App.types";
import useGoGoBtn from "./useGoGoBtn";

type GoGoBtnProps = {
  setLifts: (lifts: LiftView[]) => void;
};

export const GoGoBtn: FC<GoGoBtnProps> = () => {
  const { goGo } = useGoGoBtn();
  return <Button onClick={goGo}>Start emulation</Button>;
};
