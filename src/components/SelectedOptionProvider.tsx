import React from 'react';
import { Option } from '../models';

interface SelectedOptionContextData {
  selectedOption: Option;
  setSelectedOption: React.Dispatch<React.SetStateAction<Option>>;
}

const SelectedOptionContext = React.createContext<SelectedOptionContextData>(
  null
);

const SelectedOptionProvider: React.FunctionComponent = ({ children }) => {
  const [selectedOption, setSelectedOption] = React.useState<Option>();

  return (
    <SelectedOptionContext.Provider
      value={{
        selectedOption,
        setSelectedOption,
      }}
    >
      {children}
    </SelectedOptionContext.Provider>
  );
};

const useSelectedOption = () => {
  const context = React.useContext(SelectedOptionContext);
  if (!context) {
    throw new Error(
      'useSelectedOption must be used within a SelectedOptionProvider'
    );
  }
  return context;
};

export { SelectedOptionProvider, useSelectedOption };
