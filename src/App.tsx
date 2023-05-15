import { useMemo, useState } from "react";
import { INITIAL_FLOORS, INITIAL_LIFT_POSITIONS } from "./App.constants";
import "./App.css";
import { FloorElement } from "./Floor/Floor";
import { GenStateBtn } from "./GenStateBtn/GenStateBtn";
import { QueueOfFloors } from "./QueueOfFloors/QueueOfFloors";
import { GoDynamicBtn } from "./StartDynamicBtn/StartDynamicBtn";
import { GoStaticBtn } from "./StartStaticBtn/StartStaticBtn";
import { TopPanel } from "./TopPanel/TopPanel";
import { dispatcher } from "./core/Dispatcher";
import { emulator } from "./core/Emulator";

function App() {
  const [lifts, setLifts] = useState(INITIAL_LIFT_POSITIONS);
  const [floors, setFloors] = useState(INITIAL_FLOORS);

  useMemo(() => {
    dispatcher.consumeLiftsStateChanged(lifts, setLifts);
  }, [lifts]);

  useMemo(() => {
    dispatcher.consumeFloorsChanged(floors, setFloors);
    emulator.consumeFloorsChanged(floors, setFloors);
  }, [floors]);

  return (
    <>
      <div className="px-40">
        <QueueOfFloors />
        <div className="mb-2 flex gap-x-2">
          <GenStateBtn setLifts={setLifts} setFloors={setFloors} />
          <GoStaticBtn setLifts={setLifts}></GoStaticBtn>
          <GoDynamicBtn lifts={lifts} setLifts={setLifts} />
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
