export enum Topic {
  EmulatorStart = "EmulatorStart",
  EmulatorStop = "EmulatorStop",
  QueueManagerQueueChanged = "QueueManagerQueueChanged",
  PersonSpacePersonRemoved = "PersonSpacePersonRemoved",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TopicCallback<T = any> = (payload: T) => any;

export type Topics = {
  [key in Topic]: Set<TopicCallback>;
};
