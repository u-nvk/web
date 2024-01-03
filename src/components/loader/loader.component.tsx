import styles from "./loader.component.styles.module.css";
import {FC, useEffect, useState} from "react";

export interface LoaderComponentProps {
  showAfterMS?: number;
}

export const LoaderComponent: FC<LoaderComponentProps> = ({ showAfterMS = 1200 }) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (showAfterMS) {
      setIsShow(false);
      const index = setTimeout(() => setIsShow(true), showAfterMS)
      return () => clearTimeout(index)
    }
    setIsShow(true)
  }, []);

  return (
    <>
      {isShow && <span className={styles.loader}></span>}
    </>
  )
}
