import { useContext, useEffect } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  isValidProfileData,
  ProfileDataContext,
} from "../../context/profile-data.context";
import styles from "./styles/cabinet.layout.styles.module.css";
import HistoryIcon from "/history.svg?url";
import OrdersIcon from "/orders.svg?url";
import ProfileIcon from "/profile.svg?url";

export const CabinetLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/cabinet/") {
      navigate("/cabinet/orders", { replace: true });
    }
  }, [location.pathname, navigate]);

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
          <p className={`${styles.iconText} regularText`}>История</p>
        </Link>
        <Link to={"orders"} className={styles.barElement}>
          <img src={OrdersIcon} alt="Поездки" />
          <p className={`${styles.iconText} regularText`}>Поездки</p>
        </Link>
        <Link to={"profile"} className={styles.barElement}>
          <img src={ProfileIcon} alt="Профиль" />
          <p className={`${styles.iconText} regularText`}>Профиль</p>
        </Link>
      </div>
    </div>
  );
};
