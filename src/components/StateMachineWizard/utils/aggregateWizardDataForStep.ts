import { NavHistoryItem } from "..";
export function aggregateWizardDataForStep<T extends object, V extends string>(
  stepPosition: number,
  navHistory: NavHistoryItem<V>[],
  wizardStateBySteps: Record<V, T>,
): {} {
  if (stepPosition < 0 || stepPosition >= navHistory.length) return {};
  return navHistory.slice(0, stepPosition + 1).reduce(
    (aggregated, { stepName }) => ({
      ...aggregated,
      ...wizardStateBySteps[stepName],
    }),
    {},
  );
}
