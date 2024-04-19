interface StepConfig<StateType, StepNames extends string> {
  canAdvance?: (currentState: StateType) => boolean;
  choices: Partial<
    Record<StepNames, { when?: (currentState: StateType) => boolean }>
  >;
  isTerminal?: never;
}

interface TerminalStepConfig {
  isTerminal: true;
}

export interface StateMachineConfig<StateType, StepNames extends string> {
  initialStep: string | ((currentState: StateType) => string);
  steps: Record<
    StepNames,
    StepConfig<StateType, StepNames> | TerminalStepConfig
  >;
  views: Record<StepNames, React.ComponentType>;
}

export interface NavHistoryItem<T> {
  Component: React.ReactElement;
  stepName: T;
}
