import styles from "./loader.component.styles.module.css";
import {FC, useEffect, useState} from "react";

export interface LoaderComponentProps {
  showAfterMS?: number;
}

export const LoaderComponent: FC<LoaderComponentProps> = ({ showAfterMS }) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (showAfterMS) {
      setIsShow(false);
      const index = setTimeout(() => setIsShow(true), showAfterMS)
      return () => clearTimeout(index)
    }
  }, []);

  return (
    <>
      {isShow && <span className={styles.loader}></span>}
    </>
  )
}
