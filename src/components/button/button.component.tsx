import {FC} from "react";
import styles from "./button.component.styles.module.css";

export interface IButtonComponentProps {
  title: string;
  onClick: () => void;
}

export const ButtonComponent: FC<IButtonComponentProps> = ({ title, onClick }) => {
  return (
    <div className={`${styles.wrapperBtn} regularText`} onClick={onClick}>
      {title}
    </div>
  )
}
