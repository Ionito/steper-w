import React from "react";
const Step = <V extends string>({
  view,
  viewProps = {},
  stepName,
  isActive,
}: {
  view: React.ReactElement;
  viewProps?: object;
  stepName: V;
  isActive: boolean;
}) => {
  let childrenView = view;
  if (React.isValidElement(view)) {
    childrenView = React.cloneElement(view, viewProps);
  }
  return isActive ? <div key={stepName}>{childrenView}</div> : null;
};

export { Step };
