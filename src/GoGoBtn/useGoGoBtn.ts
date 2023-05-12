import { dispatcher } from "./Dispatcher";

const useGoGoBtn = () => {
  const goGo = (): void => {
    if (dispatcher.isRunning()) {
      window.alert("Existing emulation is still running");
      return;
    }

    const decision = window.confirm("Are you sure you want to start emulation?");
    if (!decision) {
      return;
    }

    dispatcher.startEmulation();
  };

  return {
    goGo,
  };
};
export default useGoGoBtn;
