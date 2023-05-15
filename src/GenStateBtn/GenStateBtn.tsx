import { Button } from "antd";
import { FC } from "react";
import { GenStateBtnProps } from "./GenStateBtn.types";
import useGenStateBtn from "./hooks/useGenStateBtn";

export const GenStateBtn: FC<GenStateBtnProps> = ({ setLifts, setFloors }) => {
  const { generateRandomState } = useGenStateBtn({ setLifts, setFloors });

  return <Button onClick={generateRandomState}>Generate random state</Button>;
};
