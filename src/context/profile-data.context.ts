import { createContext } from "react";

export const ProfileDataContext = createContext<ProfileDataContext>({
  data: null,
  setData: null,
  clear: () => {}
});

export interface ProfileDataContext {
  data: (() => ProfileData) | null;
  // TODO: поправить
  setData: ((data: ProfileData) => void) | null;
  clear: () => void;
}

export interface ProfileData {
  accessToken: string;
}

export const isValidProfileData = (obj: unknown): obj is ProfileData => {
  return !!(
    obj &&
    typeof obj === "object" &&
    "accessToken" in obj &&
    //@ts-ignore
    typeof obj.accessToken === "string"
  );
};
