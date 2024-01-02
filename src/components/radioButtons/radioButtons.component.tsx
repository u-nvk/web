import styles from "./radioButtons.component.styles.module.css";
import {useState} from "react";

type ValueType = {
  value: string;
  onChange: (value: string) => void;
  isActive: boolean,
};
const RadioButton = ({ value, onChange, isActive }: ValueType) => (
  <div
    className={`${styles.labelStyle} ${isActive ? styles.activeLabelStyle : ''} regularText`}
    onClick={() => onChange(value)}
  >
    <div>{value}</div>
    <input
      type="radio"
      value={value}
      checked={isActive}
      onChange={() => onChange(value)}
      style={{
        display: "none",
      }}
    />
  </div>
);

export type RadioButtonOption = {
  value: string;
  name: string;
}

type IProps = {
  options: RadioButtonOption[],
  setValue: (selectedOption: RadioButtonOption) => void,
};

const RadioButtons = ({ options, setValue }: IProps) => {
  const [currValue, setCurrValue] = useState(options[0]);

  const handleRadioChange = (value: RadioButtonOption) => {
    setCurrValue(value);
    setValue(value);
  };

  return (
    <div>
      {options.map((value) => (
        <RadioButton
          key={value.value}
          value={value.name}
          isActive={currValue.value === value.value}
          onChange={() => handleRadioChange(value)}
        />
      ))}
    </div>
  );
};

export default RadioButtons;
