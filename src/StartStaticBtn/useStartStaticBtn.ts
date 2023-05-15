import { useEffect, useState } from "react";
import { emulator } from "../core/Emulator";
import { mediator } from "../core/Mediator";
import { Topic } from "../core/Mediator.types";

const useStartStaticBtn = () => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const reactToEmulatorStop = () => {
      setDisabled(false);
    };
    mediator.subscribe(Topic.EmulatorStop, reactToEmulatorStop);

    const reactToEmulatorStart = () => {
      setDisabled(true);
    };
    mediator.subscribe(Topic.EmulatorStart, reactToEmulatorStart);

    return () => {
      mediator.unsubscribe(Topic.EmulatorStop, reactToEmulatorStop);
      mediator.unsubscribe(Topic.EmulatorStart, reactToEmulatorStart);
    };
  }, []);

  const startStaticEmulation = (): void => {
    emulator.startStaticEmulation();
  };

  return {
    startStaticEmulation,
    disabled,
  };
};
export default useStartStaticBtn;
