import { useContext } from "react";
import { Navigate, Outlet, redirect } from "react-router-dom";
import {
  isValidProfileData,
  ProfileDataContext,
} from "../../context/profile-data.context";

export const CabinetLayout = () => {
  const profileContext = useContext(ProfileDataContext);

  if (!isValidProfileData(profileContext.data?.())) {
    return <Navigate to={"/auth"} replace />;
  }

  return (
    <>
      <div>Cabinet Layout</div>
      <Outlet />
    </>
  );
};
