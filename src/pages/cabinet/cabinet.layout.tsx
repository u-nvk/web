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
          <>
            <svg className={`${styles.icon} ${styles.time}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="11" stroke="black" stroke-width="2"/>
              <path d="M11 6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V15H11V6Z" fill="black"/>
              <path
                d="M16.664 16.6819C17.118 17.0288 17.1927 17.6834 16.8286 18.1237C16.4878 18.5359 15.8842 18.6097 15.4541 18.2918L11 15L12.5 13.5L16.664 16.6819Z"
                fill="black"/>
            </svg>
          </>
          <p className={`${styles.iconText} regularText`}>История</p>
        </Link>
        <Link to={"orders"} className={styles.barElement}>
          <>
            <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="5" rx="2.5" fill="black"/>
              <rect y="19" width="24" height="5" rx="2.5" fill="black"/>
              <rect y="9" width="24" height="5" rx="2.5" fill="black"/>
            </svg>
          </>
          <p className={`${styles.iconText} regularText`}>Поездки</p>
        </Link>
        <Link to={"profile"} className={styles.barElement}>
          <>
            <svg className={`${styles.icon} ${styles.profileIcon}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20C0 17.2386 2.23858 15 5 15H19C21.7614 15 24 17.2386 24 20V24H0V20Z" fill="black"/>
              <circle cx="12" cy="6" r="6" fill="black"/>
            </svg>
          </>
          <p className={`${styles.iconText} regularText`}>Профиль</p>
        </Link>
      </div>
    </div>
  );
};
