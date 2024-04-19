import { NavHistoryItem } from "..";
export function findStepPositionByName<V extends string>(
  navHistory: NavHistoryItem<V>[],
  stepName: V,
) {
  return navHistory.findIndex(
    ({ stepName: navStepName }) => navStepName === stepName,
  );
}
