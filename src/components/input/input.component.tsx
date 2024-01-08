import styles from "./input.component.styles.module.css";
import {FC, useEffect, useState} from "react";

export interface InputComponentProps {
  defaultText?: string;
  onChange?: (text: string) => void;
  isReadonly: boolean;
  maxLength?: number;
  isNumberOnyl?: boolean
  placeholder?: string;
}

export const InputComponent: FC<InputComponentProps> = ({ defaultText, onChange, isReadonly, maxLength, isNumberOnyl, placeholder }) => {
  const [currentText, setCurrentText] = useState('');

  const handleValue = (value: string) => {
    if (maxLength && value.length > maxLength) {
      return;
    }

    setCurrentText(value);
    onChange?.(value);
  }

  useEffect(() => {
    if (defaultText) {
      setCurrentText(defaultText);
    }
  }, []);

  return (
    <div className={`${styles.wrapper}`}>
      {!isNumberOnyl && <input readOnly={isReadonly} value={currentText} placeholder={placeholder ?? ''} onChange={(e) => handleValue(e.target.value)} maxLength={maxLength} className={`${styles.input} regularText`} type={isNumberOnyl ? 'number' : 'text'}/>}
      {isNumberOnyl && <input readOnly={isReadonly} value={currentText} placeholder={placeholder ?? ''} onChange={(e) => handleValue(e.target.value)}
                              className={`${styles.input} regularText`}
                              pattern="\d*"
                              type={isNumberOnyl ? 'number' : 'text'}/>}
    </div>
  )
}
