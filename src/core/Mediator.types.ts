export enum Topic {
  EmulatorStart = "EmulatorStart",
  EmulatorStop = "EmulatorStop",
  QueueManagerQueueChanged = "QueueManagerQueueChanged",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TopicCallback = (payload: any) => any;

export type Topics = {
  [key in Topic]: Set<TopicCallback>;
};
