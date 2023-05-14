import { FC } from "react";
import { Floor, Floors } from "../App.types";
import { queueManager } from "../GoGoBtn/QueueManager";

type PersonsSpaceProps = {
  floor: Floor;
  setFloors: React.Dispatch<React.SetStateAction<Floors>>;
};

export const PersonsSpace: FC<PersonsSpaceProps> = ({ floor, setFloors }) => {
  const { persons, floorNum } = floor;

  const removePerson = (personIdx: number): void => {
    const newPersons = persons.slice(0, personIdx).concat(persons.slice(personIdx + 1));
    setFloors((prevState) => ({
      ...prevState,
      ...{ [floorNum]: { floorNum, persons: newPersons } },
    }));
    // if more cases like this, I would think about mediator class for handling similar events
    queueManager.handlePersonRemovedFromTheFloor(floorNum, newPersons);
  };

  return (
    <div className="space-for-persons flex w-28 flex-wrap items-end gap-1 leading-none">
      {floor.persons.length
        ? floor.persons.map((person, idx) => {
            return (
              <div
                key={idx}
                className="person cursor-pointer border border-solid border-black "
                title={`I am a person and I am going to ${person.goingToFloor} floor`}
                onClick={() => removePerson(idx)}
              >
                <span className="text-sm">{person.goingToFloor}</span>
              </div>
            );
          })
        : ""}
    </div>
  );
};
