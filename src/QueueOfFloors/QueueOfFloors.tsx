import { FC, useEffect, useState } from "react";
import { queueManager } from "../core/QueueManager";
import { QueueItem } from "../core/QueueManager.types";

export const QueueOfFloors: FC = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  useEffect(() => {
    const cb = (q: QueueItem[]) => {
      setQueueItems(q);
    };
    const currentItems = queueManager.subscribeToQueueChange(cb);
    setQueueItems(currentItems);
    return () => {
      queueManager.unsubscribeFromQueueChange(cb);
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
