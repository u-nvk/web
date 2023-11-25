import { useContext } from "react";
import { Navigate, Outlet, redirect } from "react-router-dom";
import { ProfileDataContext } from "../../context/profile-data.context";

export const CabinetLayout = () => {
  const profileContext = useContext(ProfileDataContext);

  if (!profileContext.data || !profileContext.data.accessToken) {
    return <Navigate to={"/auth"} replace />;
  }

  return (
    <>
      <div>Cabinet Layout</div>
      <Outlet />
    </>
  );
};
