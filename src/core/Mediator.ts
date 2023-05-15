import { Topic, TopicCallback, Topics } from "./Mediator.types";

export class Mediator {
  private topics: Topics;

  constructor() {
    this.topics = Object.values(Topic).reduce<Topics>((acc, topic) => {
      acc[topic] = new Set();
      return acc;
    }, {} as Topics);
  }

  subscribe(topic: Topic, callback: TopicCallback): void {
    this.topics[topic].add(callback);
  }

  unsubscribe(topic: Topic, callback: TopicCallback): void {
    this.topics[topic].delete(callback);
  }

  publish(topic: Topic, payload?: unknown): void {
    for (const callback of Array.from(this.topics[topic])) {
      callback(payload);
    }
  }
}

export const mediator = new Mediator();
