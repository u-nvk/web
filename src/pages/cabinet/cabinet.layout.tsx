import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  isValidProfileData,
  ProfileDataContext,
} from "../../context/profile-data.context";
import styles from "./styles/cabinet.layout.styles.module.css";

export const CabinetLayout = () => {
  const profileContext = useContext(ProfileDataContext);

  if (!isValidProfileData(profileContext.data?.())) {
    return <Navigate to={"/auth"} replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.bar}>Здесь футер с кнопками</div>
    </div>
  );
};
