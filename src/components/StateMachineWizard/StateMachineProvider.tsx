import {
  createContext,
  useMemo,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";
import { NavHistoryItem, StateMachineConfig } from ".";
import {
  findStepPositionByName,
  getStepView,
  aggregateWizardDataForStep,
} from "./utils";

type Props<T, V extends string> = {
  curStepPos: number;
  navHistory: NavHistoryItem<V>[];
  updateNavHistory: React.Dispatch<React.SetStateAction<NavHistoryItem<V>[]>>;
  setWizardData: React.Dispatch<
    React.SetStateAction<Record<string, Partial<T>>>
  >;
  wizardDataByStep: Record<string, Partial<T>>;
  curStepName: V;
  setCurStepName: React.Dispatch<React.SetStateAction<V>>;
  stateMachineConfig: StateMachineConfig<T, V>;
};

export type StateMachineContextValue = {
  errors: string[];
  setStepData: (stepData: {} | ((prev: {}, agregated: {}) => {})) => void;
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
  navigateTo: (step: number) => void;
  onNextClick: () => void;
};

export const StateMachineWizardContext =
  createContext<StateMachineContextValue>({} as StateMachineContextValue);

export const StateMachineProvider = <T, V extends string>({
  children,
  curStepPos,
  navHistory,
  updateNavHistory,
  setWizardData,
  wizardDataByStep,
  curStepName,
  setCurStepName,
  stateMachineConfig,
}: PropsWithChildren<Props<T, V>>) => {
  console.log("stateMachineConfig", stateMachineConfig);
  const aggregatedStepState = useMemo<{}>(
    () => aggregateWizardDataForStep(curStepPos, navHistory, wizardDataByStep),
    [curStepPos, navHistory, wizardDataByStep],
  );

  const setStepData = useCallback(
    (
      stepData:
        | Partial<T>
        | ((prev: Partial<T>, agregated: Partial<T>) => Partial<T>),
    ) => {
      if (curStepPos === -1) {
        return;
      }
      const { stepName } = navHistory[curStepPos];
      setWizardData((prevState) => ({
        ...prevState,
        [stepName]:
          typeof stepData === "function"
            ? stepData(prevState[stepName], aggregatedStepState)
            : { ...prevState[stepName], ...stepData },
      }));
    },
    [navHistory, curStepPos, aggregatedStepState],
  );

  const navigateTo = useCallback(
    (step: number | V) => {
      const stepPos =
        typeof step === "number"
          ? curStepPos + step
          : findStepPositionByName(navHistory, step);
      if (
        stepPos < 0 ||
        stepPos >= navHistory.length ||
        navHistory[stepPos].stepName === curStepName
      )
        return;
      setCurStepName(navHistory[stepPos].stepName);
    },
    [curStepPos, navHistory],
  );

  const [errors, setErrors] = useState<string[]>([]);

  const determineNextStep = (stepName: V, stepState: T) => {
    console.log("CONFIG", stateMachineConfig);
    const stepMetadata = stateMachineConfig.steps[stepName];
    console.log("METADATA", stepMetadata);
    if (stepMetadata.isTerminal) {
      return undefined;
    }
    const availableTransitions = stepMetadata.choices;

    return Object.keys(availableTransitions).find(
      (transitionStepName) =>
        // if when condition is not specified, this step is automatically selected as next
        // that's why it's recommended to define such fallback steps in the end of choices map
        !availableTransitions[transitionStepName as V]?.when ||
        !!availableTransitions[transitionStepName as V]?.when?.(stepState),
    );
  };

  //TODO: add callback
  const onNextClick = () => {
    const nextStepName = determineNextStep(
      navHistory[curStepPos].stepName,
      aggregatedStepState as T,
    ) as V;
    if (!nextStepName) {
      return;
    }
    // if we reached the end of the history or next step is different from what we had before
    if (
      curStepPos === navHistory.length - 1 ||
      navHistory[curStepPos + 1].stepName !== nextStepName
    ) {
      const trailingSteps = navHistory.slice(curStepPos + 1);
      // cleanup wizard state for trailing steps
      setWizardData((prevData) =>
        trailingSteps.reduce(
          (updatedWizardData, stepToDelete) => {
            delete updatedWizardData[stepToDelete.stepName];
            return updatedWizardData;
          },
          { ...prevData },
        ),
      );
      // cleanup transitions after current step and add new step
      const NextView = getStepView(stateMachineConfig, nextStepName);
      updateNavHistory((prevNav) =>
        prevNav
          .slice(0, curStepPos + 1)
          .concat({ Component: <NextView />, stepName: nextStepName }),
      );
    }
    setCurStepName(nextStepName);
  };

  const contextValue = useMemo(
    () => ({
      errors,
      setStepData,
      setErrors,
      navigateTo,
      onNextClick,
    }),
    [errors, setStepData, setErrors, navigateTo],
  );

  return (
    <StateMachineWizardContext.Provider value={contextValue}>
      {children}
    </StateMachineWizardContext.Provider>
  );
};
