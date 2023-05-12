import { Button } from "antd";
import { FC } from "react";
import { dispatcher } from "../GoGoBtn/Dispatcher";

export const StopBtn: FC = () => {
  const stopEmulation = () => {
    dispatcher.stopEmulation();
  };
  return <Button onClick={stopEmulation}>Stop emulation</Button>;
};
