import { createContext, useContext } from "react";

export const ProfileDataContext = createContext<ProfileDataContext>({
  data: null,
  setData: null,
});

export interface ProfileDataContext {
  data: ProfileData | null;
  // TODO: поправить
  setData: any;
}

export interface ProfileData {
  accessToken: string;
}
