import { Button } from "antd";
import { FC } from "react";
import { emulator } from "../Emulator/Emulator";

export const StopBtn: FC = () => {
  const stopEmulation = () => {
    emulator.stopStaticEmulation();
    emulator.stopDynamicEmulation();
  };
  return <Button onClick={stopEmulation}>Stop emulation</Button>;
};
