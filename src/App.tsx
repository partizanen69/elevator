import { useMemo, useState } from "react";
import { INITIAL_FLOORS, INITIAL_LIFT_POSITIONS } from "./App.constants";
import "./App.css";
import { FloorElement } from "./Floor/Floor";
import { GenStateBtn } from "./GenStateBtn/GenStateBtn";
import { dispatcher } from "./GoGoBtn/Dispatcher";
import { GoGoBtn } from "./GoGoBtn/GoGoBtn";
import { StopBtn } from "./StopBtn/StopBtn";
import { TopPanel } from "./TopPanel/TopPanel";

function App() {
  const [lifts, setLifts] = useState(INITIAL_LIFT_POSITIONS);
  const [floors, setFloors] = useState(INITIAL_FLOORS);

  useMemo(() => {
    dispatcher.consumeLiftsStateChanged(lifts, setLifts);
  }, [lifts]);

  useMemo(() => {
    dispatcher.consumeFloorsChanged(floors, setFloors);
  }, [floors]);

  return (
    <>
      <div className="px-40">
        <div className="mb-2 flex gap-x-2">
          <GenStateBtn setLifts={setLifts} setFloors={setFloors} />
          <GoGoBtn setLifts={setLifts}></GoGoBtn>
          <StopBtn />
        </div>
        <div className="building flex flex-col">
          <TopPanel lifts={lifts} setLifts={setLifts} />
          {Object.values(floors)
            .reverse()
            .map((floor) => (
              <FloorElement
                key={floor.floorNum}
                floor={floor}
                lifts={lifts}
                setFloors={setFloors}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
