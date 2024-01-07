import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {ProfileDataContext} from "../../context/profile-data.context.ts";

export const useLogout = () => {
  const navigate = useNavigate();
  const profileContext = useContext(ProfileDataContext);

  return () => {
    localStorage.clear();
    profileContext.setData
    navigate('/auth');
  }
}
