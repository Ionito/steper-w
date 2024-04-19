import { StateMachineConfig } from "../../components/StateMachineWizard";
import AuthComponent from "./components/AuthComponent";
import ConfirmationComponent from "./components/ConfirmationComponent";
import EnterCustomerDetailsComponent from "./components/EnterCustomerDetailsComponent";
import PaymentComponent from "./components/PaymentComponent";
import SelectInsuranceProductComponent from "./components/SelectInsuranceProductComponent";
import SetInsurancePeriodComponent from "./components/SetInsurancePeriodComponent";
import SpecifyCarCoverageComponent from "./components/SpecifyCarCoverageComponent";
import SpecifyCarDetailsComponent from "./components/SpecifyCarDetailsComponent";
import SpecifyHomeCoverageComponent from "./components/SpecifyHomeCoverageComponent";
import SpecifyHomeDetailsComponent from "./components/SpecifyHomeDetailsComponent";

export type WizardState = {
  selectedProduct: "car" | "home" | "bundle";
  customerDetails: {
    firstName: string;
    lastName: string;
  };
  carInsuranceCoverage: {};
  homeInsuranceCoverage: {};
  carDetails: {
    licenseNumber: string;
  };
  propertyDetails: {
    address: string;
  };
  insurancePeriod: {
    startDate: Date;
    endDate: Date;
  };
  paymentMethod: string;
};

export type StepNames =
  | "enterCustomerDetails"
  | "selectInsuranceProduct"
  | "specifyCarInsuranceCoverage"
  | "specifyCarInsuranceDetails"
  | "specifyHomeInsuranceCoverage"
  | "specifyHomeInsuranceDetails"
  | "setInsurancePeriod"
  | "authenticate"
  | "payment"
  | "confirmation";

export const stateMachineConfig: StateMachineConfig<WizardState, StepNames> = {
  initialStep: "enterCustomerDetails",
  steps: {
    enterCustomerDetails: {
      canAdvance: (currentState) => {
        console.log(currentState);
        return (
          currentState.customerDetails?.firstName != null &&
          currentState.customerDetails?.lastName != null
        );
      },
      choices: {
        selectInsuranceProduct: {}, // Move to the next step after entering details
      },
    },
    selectInsuranceProduct: {
      canAdvance: (currentState) => currentState.selectedProduct != null,
      choices: {
        // Move to specifying coverage after selecting insurance product type
        specifyCarInsuranceCoverage: {
          when: (currentState) =>
            currentState.selectedProduct === "car" ||
            currentState.selectedProduct === "bundle",
        },
        specifyHomeInsuranceCoverage: {
          when: (currentState) => currentState.selectedProduct === "home",
        },
      },
    },
    specifyCarInsuranceCoverage: {
      // For demo purposes, always allow advancing assuming there is always some default coverage selected
      choices: {
        specifyCarInsuranceDetails: {}, // Move to specifying details after selecting coverage
      },
    },
    specifyCarInsuranceDetails: {
      canAdvance: (currentState) =>
        currentState.carDetails?.licenseNumber != null,
      choices: {
        setInsurancePeriod: {},
      },
    },
    specifyHomeInsuranceCoverage: {
      // For demo purposes, always allow advancing assuming there is always some default coverage selected
      choices: {
        specifyCarInsuranceDetails: {}, // Move to specifying details after selecting coverage
      },
    },
    specifyHomeInsuranceDetails: {
      canAdvance: (currentState) =>
        currentState.propertyDetails?.address != null,
      choices: {
        setInsurancePeriod: {},
      },
    },
    setInsurancePeriod: {
      canAdvance: (currentState) =>
        currentState.insurancePeriod?.startDate <
        currentState.insurancePeriod?.endDate,
      choices: {
        // go to auth screen if user is not logged in
        authenticate: {
          when: () => !localStorage.getItem("userAuth"),
        },
        // otherwise, always fallback to paymet step (no need to specify when conditiom)
        payment: {},
      },
    },
    authenticate: {
      canAdvance: () => !!localStorage.getItem("userAuth"),
      choices: {
        payment: {}, // Move to payment after authentication
      },
    },
    payment: {
      canAdvance: (currentState) => currentState.paymentMethod != null,
      choices: {
        confirmation: {}, // Move to confirmation step after payment
      },
    },
    confirmation: {
      isTerminal: true, // This is the final step
    },
  },
  views: {
    enterCustomerDetails: EnterCustomerDetailsComponent,
    selectInsuranceProduct: SelectInsuranceProductComponent,
    specifyCarInsuranceCoverage: SpecifyCarCoverageComponent,
    specifyCarInsuranceDetails: SpecifyCarDetailsComponent,
    specifyHomeInsuranceCoverage: SpecifyHomeCoverageComponent,
    specifyHomeInsuranceDetails: SpecifyHomeDetailsComponent,
    setInsurancePeriod: SetInsurancePeriodComponent,
    authenticate: AuthComponent,
    payment: PaymentComponent,
    confirmation: ConfirmationComponent,
  },
};
