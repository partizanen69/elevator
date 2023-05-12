import { FC } from "react";
import { Floor, Floors } from "../App.types";

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
  };

  return (
    <div className="space-for-persons flex w-28 items-end gap-2">
      {floor.persons.length
        ? floor.persons.map((person, idx) => {
            return (
              <div
                key={idx}
                className="person h-[70%] cursor-pointer border border-solid border-black p-[1px]"
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
