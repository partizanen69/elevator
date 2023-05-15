import { Button, InputNumber } from "antd";
import { FC, useState } from "react";
import { FLOORS, MAX_PERSONS_PER_FLOOR } from "../App.constants";
import { Floor, Floors } from "../App.types";
import { queueManager } from "../core/QueueManager";
import { getPersonDirection } from "../utils";

type AddPersonModalProps = {
  floor: Floor;
  setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFloors: React.Dispatch<React.SetStateAction<Floors>>;
};

export const AddPersonModal: FC<AddPersonModalProps> = ({ floor, setPopoverOpen, setFloors }) => {
  const defaultFloorToGo = 1;

  const [floorToGo, setFloorToGo] = useState(defaultFloorToGo);

  const { floorNum, persons } = floor;

  const onChange = (floor: number | null) => {
    if (floor !== null) {
      setFloorToGo(floor);
    }
  };

  const onSubmit = () => {
    if (floorToGo === floorNum) {
      window.alert(`Your person can't go to the same floor it stays`);
      return;
    }

    if (persons.length >= MAX_PERSONS_PER_FLOOR) {
      window.alert("Floor is too crowded. There is no place for more then 4 persons");
      return;
    }

    setFloors((prevState) => {
      return {
        ...prevState,
        ...{
          [floorNum]: {
            floorNum,
            persons: [...persons, { goingToFloor: floorToGo, liftId: null }],
          },
        },
      };
    });

    const direction = getPersonDirection(floor.floorNum, floorToGo);
    queueManager.addInQueue(floor.floorNum, direction);

    setPopoverOpen(false);
  };

  return (
    <>
      <div>Which floor you want person to go?</div>
      <div className="flex justify-center">
        <InputNumber min={1} max={FLOORS} defaultValue={1} onChange={onChange} />
      </div>
      <div className="mt-2 flex justify-end">
        <Button block={true} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
};
