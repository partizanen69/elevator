import { useEffect, useState } from "react";
import { emulator } from "../Emulator/Emulator";

const useGoGoBtn = () => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const cb = () => {
      setDisabled(false);
    };
    emulator.addDoneSubscriber(cb);
    return () => {
      emulator.removeDoneSubscriber(cb);
    };
  }, []);

  const startStaticEmulation = (): void => {
    if (emulator.isRunning()) {
      window.alert("Existing emulation is still running");
      return;
    }

    const decision = window.confirm("Are you sure you want to start emulation?");
    if (!decision) {
      return;
    }

    emulator.startStaticEmulation();
    setDisabled(true);
  };

  return {
    startStaticEmulation,
    disabled,
  };
};
export default useGoGoBtn;
