import { useContext } from "react";
import {
  StateMachineWizardContext,
  StateMachineContextValue,
} from "../StateMachineProvider";
export const useStateMachine = () => {
  const stateMachineContext = useContext<StateMachineContextValue>(
    StateMachineWizardContext,
  );
  if (!stateMachineContext) throw "need to wrap in Provider";
  return stateMachineContext;
};
