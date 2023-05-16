## What is this?

This is the emulation of elevator management system. There are two types of emulation (with relevant buttons to run each one at the top):

1. Static emulation. You can predefine initial state (see more details in [this section](#how-to-play)) of the simulation and then run it. Static emulation will end when all passengers get delivered to their relevant destination floors.
2. Dynamic emulation. New person with random destination appears at random floor every 4 seconds (TIMEOUT_ADD_NEW_PERSON constant in src/App.constants.ts file).

## Where to play with it?

To play with it you can:

- [run app locally](#how-to-run-it-locally)
- go to https://partizanen69.github.io/elevator

## How to run it locally

```
npm ci
npm run dev
```

Then open http://localhost:5173 in your browser.

## How to play

Before running the emulation you can:

1. Add person to any floor ("Add person" button).
2. Remove person from any floor (Click on the person)
3. Move any elevator up or down.
4. Generate random initial state by clicking "Generate random state" button.
5. Run static emulation
6. Run dynamic emulation.

### Can I change number of elevators or number of floors?

You can edit the following constants in src/App.constants.ts file.

```
export const FLOORS = 15; // number of floors in the building
export const LIFTS_PER_FLOOR = 4; // number of elevators in the building
export const MAX_PERSONS_PER_FLOOR = 10; // max number of persons waiting in queue at floor (don't set to high since html may not be ready to display it correctly)
export const MAX_PERSONS_PER_LIFT = 4; // max capacity of the elevator (don't set to high since html may not be ready to display it correctly)
export const TIMEOUT_ADD_NEW_PERSON = 4000; // interval random person added to random floor during dynamic emulation
```

## Key concepts of the algorithm

The algorithm is not ideal and it has a bunch of constraints:

- There is a queue of elevator requests ("Queue of floors" area at the top of the page). It looks like [ 3-up, 4-down, 15-down, ... ]. It means that crowd on the floors were being gathered in the following sequence: first person pushed request button at the third floor and selected destination floor which was higher than 3; then second person came to the 4th floor and pushed the request button and selected destination floor which was lower than 4.
- When at least one elevator becomes idle, the first queue item takes the closest idle elevator and elevators starts moving towards the floor where person(s) waiting.
- While moving to the first queue item, elevator does not stop anywhere even if some persons wanting to move the same direction are waiting at some intermediary floor.
- After elevator takes first queue item it starts moving to the direction of that queue item and takes passengers moving the same direction at any intermediary floor.
- Elevator stops at the intermediary floor if there are persons on that floor going the same direction and if an elevator has free capacity (MAX_PERSONS_PER_LIFT constant which defaults to 4)

## Cases which you can consider as "irrational" behavior of the elevator

The following situation is possible:

You generated random state and then launched static emulation. There is a passenger 1 on the floor and there is an elevator on the floor. But after starting the emulation, that elevator does not take that passenger 1 but starts moving to another floor for taking passenger 2.

This might seem "irrational" and the explanation is the following:

Since there is queue of floors, idle elevator takes the first item from the queue. Passenger 1 pushed the request button after passenger 2 on the different floor. In real life, elevator started moving before passenger 1 pushed the request button and at that moment it was somewhere in the middle of the passenger 1 floor and the nearest floor.
