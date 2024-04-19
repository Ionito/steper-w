import ReactDom from "react-dom";
import { useState } from "react";
import { NavHistoryItem, StateMachineConfig } from ".";
import { findStepPositionByName, getStepView } from "./utils";
import { StateMachineProvider } from "./StateMachineProvider";
import { WizardSteps } from "./WizardSteps";
import CloseIcon from "../CloseIcon";
import { Footer } from "./Footer";

interface StateMachineWizardPropss<T, V extends string> {
  visible?: boolean;
  onClose?: () => void;
  header: string | React.ReactElement;
  portalContainerId?: string;
  i18nValues?: Partial<
    Record<"CloseAriaLabel" | "Cancel" | "Back" | "Next" | "Submit", string>
  >;
  stateMachineConfig: StateMachineConfig<T, V>;
  initialWizardState?: T;
}

const StateMachineWizard = <T, V extends string>({
  visible = false,
  header,
  onClose = () => {},
  i18nValues = {},
  portalContainerId,
  stateMachineConfig,
  initialWizardState = {} as T,
}: StateMachineWizardPropss<T, V>) => {
  if (!stateMachineConfig) {
    throw new Error("State machine configuration is not defined!");
  }

  // extract initial step name
  const initialStepName = (
    typeof stateMachineConfig.initialStep === "function"
      ? stateMachineConfig.initialStep(initialWizardState)
      : stateMachineConfig.initialStep
  ) as V;

  // extract initial view to render
  const InitialView = getStepView(stateMachineConfig, initialStepName);
  const [navHistory, updateNavHistory] = useState<NavHistoryItem<V>[]>([
    {
      Component: <InitialView />,
      stepName: initialStepName,
    },
  ]);

  // store current step name
  const [curStepName, setCurStepName] = useState<V>(initialStepName);
  // store wizard state chunks for each step separately
  // so we could build aggregated state based on what step we are on
  const [wizardDataByStep, setWizardData] = useState<
    Record<string, Partial<T>>
  >({
    [initialStepName]: initialWizardState,
  });

  const curStepPos = findStepPositionByName(navHistory, curStepName);

  const isFinalStep = stateMachineConfig.steps[curStepName].isTerminal;

  return ReactDom.createPortal(
    <div
      aria-hidden={!visible}
      aria-role="dialog"
      className={`${
        !visible ? "hidden" : ""
      } overflow-y-auto overflow-x-hidden z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full top-0 left-0 right-0 bottom-0 fixed `}
    >
      <StateMachineProvider
        navHistory={navHistory}
        updateNavHistory={updateNavHistory}
        curStepName={curStepName}
        curStepPos={curStepPos}
        setWizardData={setWizardData}
        wizardDataByStep={wizardDataByStep}
        setCurStepName={setCurStepName}
        stateMachineConfig={stateMachineConfig}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto my-auto">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {header}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                aria-label={i18nValues.CloseAriaLabel || "Close wizard"}
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-4 text-base text-gray-500 dark:text-gray-400">
              {/* estos valores podria sacarlos del context */}
              <WizardSteps
                wizardNavHistory={navHistory}
                wizardDataByStep={wizardDataByStep}
                curStepName={curStepName}
              />
            </div>
            {/* Modal Footer */}
            <Footer
              onClose={onClose}
              i18nValues={i18nValues}
              isFinalStep={!!isFinalStep}
            />
          </div>
        </div>
      </StateMachineProvider>
    </div>,
    portalContainerId != null
      ? document.getElementById(portalContainerId)!
      : document.body,
  );
};

export default StateMachineWizard;
