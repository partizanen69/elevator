import shuffle from "lodash/shuffle";
import { EMULATION_RUNNING_MSG, FLOORS, FLOORS_ARR, LIFTS_PER_FLOOR } from "../../App.constants";
import { Floor, Floors, LiftStatus, LiftView } from "../../App.types";
import { emulator } from "../../core/Emulator";
import { queueManager } from "../../core/QueueManager";
import { generateRandomPersons } from "../../utils";
import { GenStateBtnProps } from "../GenStateBtn.types";

const useGenStateBtn = ({ setFloors, setLifts }: GenStateBtnProps) => {
  const generateRandomLifts = (): LiftView[] => {
    const result: LiftView[] = [];

    for (let i = 0; i < LIFTS_PER_FLOOR; i++) {
      const status = LiftStatus.idle;
      const currentFloor: number = Math.ceil(Math.random() * FLOORS);

      result.push({
        id: i,
        status,
        currentFloor,
        targetFloors: [],
        persons: [],
      });
    }
    return result;
  };

  const generateRandomFloors = (): Floors => {
    // let's imagine we want 5 floors to be filled with persons
    const floorsWithPersons = new Set(shuffle(FLOORS_ARR).slice(0, 5));

    const floors = FLOORS_ARR.reduce<Floors>((acc, floorNum) => {
      const floor: Floor = floorsWithPersons.has(floorNum)
        ? { floorNum, persons: generateRandomPersons(floorNum) }
        : { floorNum, persons: [] };

      if (floor.persons.length) {
        queueManager.addBunchOfPersonsToTheQueue(floor.floorNum, floor.persons);
      }

      acc[floorNum] = floor;
      return acc;
    }, {});

    return floors;
  };

  const generateRandomState = () => {
    if (emulator.isRunning()) {
      window.alert(EMULATION_RUNNING_MSG);
      return;
    }
    queueManager.flushQueue();
    setLifts(generateRandomLifts());
    setFloors(generateRandomFloors());
  };

  return {
    generateRandomState,
  };
};

export default useGenStateBtn;
