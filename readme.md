- add bonus functionality:
  Bonus: Add functionality which can initialize with all elevators as empty on the
  ground floor. Then let it randomly add a passenger at random floor with random
  destination. it should trigger every 5 seconds and will display the final status of
  all elevators.

- do final refactoring

- add documentation describing how algorithm works

- depending on time left, think about mediator to handle person removed

## After generating random state you may see unexpected behavior

Case when lift is idle on the floor and there are persons also on that floor and the elevator does not load those persons and instead going somewhere else. This happens because those persons pushed the request button later than person on the another floor.
Since this is emulation it might seem wrong, but in reality the when

## How generate random state works?

it added
