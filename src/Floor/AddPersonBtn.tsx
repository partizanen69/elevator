import { Button, Popover } from "antd";
import { FC, useState } from "react";
import { Floor, Floors } from "../App.types";
import { AddPersonModal } from "./AddPersonModal";

type AddPersonBtnProps = {
  floor: Floor;
  setFloors: React.Dispatch<React.SetStateAction<Floors>>;
};

export const AddPersonBtn: FC<AddPersonBtnProps> = ({ floor, setFloors }) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const { floorNum } = floor;

  const handleOpenChange = (newOpen: boolean) => {
    setPopoverOpen(newOpen);
  };

  return (
    <div className="flex items-center gap-x-2">
      <div className="floorSign min-w-[20px]">{floorNum}</div>

      <Popover
        content={
          <AddPersonModal setFloors={setFloors} setPopoverOpen={setPopoverOpen} floor={floor} />
        }
        trigger="click"
        open={isPopoverOpen}
        onOpenChange={handleOpenChange}
      >
        <Button>Add person</Button>
      </Popover>
    </div>
  );
};
