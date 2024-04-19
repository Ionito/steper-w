const getStepView = <T, V extends string>(
  stateMachineConfig: StateMachineConfig<T, V>,
  stepName: V,
): React.ComponentType => stateMachineConfig.views[stepName];

export { getStepView };
