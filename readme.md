## What is this?

This is the emulation of elevator management system. There are two types of emulation (with relevant buttons to run each one at the top):

1. Static emulation. You can predefine initial state (see more details in [this section](#how-to-play)) of the simulation and then run it, e.g. Static emulation will end when all passengers get delivered to their relevant destination floors.
2. Dynamic emulation. New person with random destination appears at random floor every 5 seconds.

## Where to play with it?

To play with it you can:

- run app locally
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
export const LIFTS_PER_FLOOR = 4; // number of lifts in the building
export const MAX_PERSONS_PER_FLOOR = 10; // max number of persons waiting in queue at floor (don't set to high since html may not be ready)
export const MAX_PERSONS_PER_LIFT = 4; // max capacity of the elevator (don't set to high since html may not be ready)
export const TIMEOUT_ADD_NEW_PERSON = 4000; // interval random person added to random floor during dynamic emulation
```

## Key concepts of the algorithm

There is a queue

## After generating random state you may see unexpected behavior

It is based on minimum waiting time for the passenger

Case when lift is idle on the floor and there are persons also on that floor and the elevator does not load those persons and instead going somewhere else. This happens because those persons pushed the request button later than person on the another floor.
Since this is emulation it might seem wrong, but in reality the when

## How generate random state works?

it added
