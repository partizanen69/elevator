import { FC } from "react";
import { LiftStatus, LiftView } from "../App.types";

type LiftElementProps = {
  lift: LiftView;
  floorNum: number;
};

export const LiftElement: FC<LiftElementProps> = ({ lift, floorNum }) => {
  const liftIsHere: boolean = lift.currentFloor === floorNum;
  const liftIsHereClass = liftIsHere ? "bg-lime-200" : "";

  return (
    <div
      className={"elevator h-[100%] w-[50px] border border-solid border-black " + liftIsHereClass}
    >
      <div className="">
        <div className="text-center text-sm">
          {!liftIsHereClass ? "" : lift.status === LiftStatus.idle ? "idle" : "moving"}
        </div>
        {liftIsHere && lift.persons.length ? (
          <div className="flex flex-wrap justify-center text-xs">
            {lift.persons.map((person, idx) => (
              <div key={idx} className="m-[1px] border border-solid border-black">
                {person.goingToFloor}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
