import styles from "./radioButtons.component.styles.module.css";

type ValueType = {
  value: number;
  checkedValue: number | null;
  onChange: (value: number) => void;
};
const RadioButton = ({ value, checkedValue, onChange }: ValueType) => (
  <label
    className={
      value === checkedValue
        ? `${styles.labelStyle} ${styles.activeLabelStyle} regularText`
        : `${styles.labelStyle} regularText`
    }
    onClick={() => onChange(value)}
  >
    {value}
    <input
      type="radio"
      value={value}
      checked={value === checkedValue}
      onChange={() => onChange(value)}
      style={{
        display: "none",
      }}
    />
  </label>
);

type IProps = {
  selectedValue: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>;
};

const RadioButtons = ({ selectedValue, setSelectedValue }: IProps) => {
  const handleRadioChange = (value: number) => {
    setSelectedValue(value);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5, 6].map((value) => (
        <RadioButton
          key={value}
          value={value}
          checkedValue={selectedValue}
          onChange={handleRadioChange}
        />
      ))}
    </div>
  );
};

export default RadioButtons;
