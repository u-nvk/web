import { useContext } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import {
  isValidProfileData,
  ProfileDataContext,
} from "../../context/profile-data.context";
import styles from "./styles/cabinet.layout.styles.module.css";
import HistoryIcon from "../../icons/history.svg";
import OrdersIcon from "../../icons/orders.svg";
import ProfileIcon from "../../icons/profile.svg";

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
      <div className={styles.bar}>
        <Link to={"history"} className={styles.barElement}>
          <img src={HistoryIcon} alt="История" />
          <p className={styles.iconText}>История</p>
        </Link>
        <Link to={"orders"} className={styles.barElement}>
          <img src={OrdersIcon} alt="Поездки" />
          <p className={styles.iconText}>Поездки</p>
        </Link>
        <Link to={"profile"} className={styles.barElement}>
          <img src={ProfileIcon} alt="Профиль" />
          <p className={styles.iconText}>Профиль</p>
        </Link>
      </div>
    </div>
  );
};
