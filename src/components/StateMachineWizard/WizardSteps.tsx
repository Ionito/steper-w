import React from "react";
import { NavHistoryItem } from ".";
import { Step } from "./Step";

const WizardSteps = React.memo(
  <T extends object, V extends string>({
    wizardNavHistory,
    wizardDataByStep,
    curStepName,
  }: {
    wizardNavHistory: NavHistoryItem<V>[];
    wizardDataByStep: Record<V, Partial<T>>;
    curStepName: V;
  }) => {
    let aggregateWizardData = {};
    return (
      <>
        {React.Children.map(
          wizardNavHistory.map(({ Component }) => Component),
          (Component, i) => {
            if (!Component) return null;
            const { stepName } = wizardNavHistory[i];
            const isActive = stepName === curStepName;
            aggregateWizardData = {
              ...aggregateWizardData,
              ...wizardDataByStep[stepName],
            };
            const props = {
              isActive,
              stepName,
              view: Component,
              viewProps: aggregateWizardData,
            };

            return <Step key={stepName} {...props} />;
          },
        )}
      </>
    );
  },
);

export { WizardSteps };
