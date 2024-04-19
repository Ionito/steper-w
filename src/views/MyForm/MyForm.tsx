import { useCallback, useState } from "react";
import StateMachineWizard from "../../components/StateMachineWizard";
import { stateMachineConfig } from "./wizard-config";

const MyForm = () => {
  const [isVisible, setIsVisible] = useState(true);
  const handlerClose = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);
  return (
    <StateMachineWizard
      stateMachineConfig={stateMachineConfig}
      header="My wizard"
      visible={isVisible}
      onClose={handlerClose}
    />
  );
};

export default MyForm;
