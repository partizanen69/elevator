import { FC } from "react";
import { LIFTS_PER_FLOOR } from "../App.constants";
import { Floor, Floors, LiftView } from "../App.types";
import { PersonsSpace } from "../PersonsSpace/PersonsSpace";
import { AddPersonBtn } from "./AddPersonBtn";
import { LiftElement } from "./Lift";

type FloorProps = {
  floor: Floor;
  lifts: LiftView[];
  setFloors: React.Dispatch<React.SetStateAction<Floors>>;
};

export const FloorElement: FC<FloorProps> = ({ floor, lifts, setFloors }) => {
  const { floorNum } = floor;

  return (
    <div key={floorNum} className="floor flex h-20 border border-solid border-black px-12 pt-4">
      <PersonsSpace floor={floor} setFloors={setFloors} />
      {new Array(LIFTS_PER_FLOOR).fill(null).map((_, j) => {
        return (
          <div className="mx-2 block flex" key={j}>
            <div className="left-side h-[100%] w-[20px] border border-solid border-black"></div>
            <LiftElement lift={lifts[j]} floorNum={floorNum} />

            <div className="right-side h-[100%] w-[20px] border border-solid border-black"></div>
          </div>
        );
      })}
      <AddPersonBtn setFloors={setFloors} floor={floor} />
    </div>
  );
};
