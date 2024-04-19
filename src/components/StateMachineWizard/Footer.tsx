import { useStateMachine } from "./hooks";

type Props = {
  onClose: () => void;
  i18nValues: Record<string, string>;
  isFinalStep: boolean;
};

const Footer = ({ onClose, i18nValues, isFinalStep }: Props) => {
  const { onNextClick } = useStateMachine();
  const onSubmitClick = () => {};

  const onBackClick = () => {};

  return (
    <div className="flex justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
      <div>
        <button
          type="button"
          className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={onClose}
        >
          {i18nValues.Cancel || "Cancel"}
        </button>
      </div>
      <div>
        <button
          type="button"
          className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={onBackClick}
        >
          {i18nValues.Back || "Back"}
        </button>
        {!isFinalStep && (
          <button
            type="button"
            className="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={onNextClick}
          >
            {i18nValues.Next || "Next"}
          </button>
        )}
        {isFinalStep && (
          <button
            type="button"
            className="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={onSubmitClick}
          >
            {i18nValues.Submit || "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export { Footer };
