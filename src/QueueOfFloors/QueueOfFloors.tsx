import { FC, useEffect, useState } from "react";
import { queueManager } from "../GoGoBtn/QueueManager";
import { QueueItem } from "../GoGoBtn/QueueManager.types";

export const QueueOfFloors: FC = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  useEffect(() => {
    const currentItems = queueManager.subscribeToQueueChange(setQueueItems);
    setQueueItems(currentItems);
    return () => {
      queueManager.unsubscribeFromQueueChange(setQueueItems);
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
