import { FC, useEffect, useState } from "react";
import { mediator } from "../core/Mediator";
import { Topic } from "../core/Mediator.types";
import { queueManager } from "../core/QueueManager";
import { QueueItem } from "../core/QueueManager.types";

export const QueueOfFloors: FC = () => {
  const [queueItems, setQueueItems] = useState<readonly QueueItem[]>(queueManager.getItems());

  useEffect(() => {
    const cb = (q: QueueItem[]) => {
      setQueueItems(q);
    };
    mediator.subscribe(Topic.QueueManagerQueueChanged, cb);
    return () => {
      mediator.unsubscribe(Topic.QueueManagerQueueChanged, cb);
    };
  }, []);

  return (
    <div className="mb-2 flex flex-wrap gap-1 text-sm">
      Queue of floors: [
      {queueItems.map((q, idx) => (
        <div key={idx}>
          {q.floorNum}-{q.direction}
        </div>
      ))}
      ]
    </div>
  );
};
