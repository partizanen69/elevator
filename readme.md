- remove button "stop emulation" user should reload the page if he wants to restart
  - so no need in subscriptions for end emulation
- add check if emulation is running on generate random state

- do final refactoring

- add documentation describing how algorithm works

- depending on time left, think about mediator to handle person removed

## After generating random state you may see unexpected behavior

Case when lift is idle on the floor and there are persons also on that floor and the elevator does not load those persons and instead going somewhere else. This happens because those persons pushed the request button later than person on the another floor.
Since this is emulation it might seem wrong, but in reality the when

## How generate random state works?

it added
