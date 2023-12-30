import {useJwtDecoder} from "./jwt-decode.hook.ts";
import {useContext} from "react";
import {ProfileDataContext} from "../../context/profile-data.context.ts";

export const useIdFromToken = (): () => string => {
  const jwtDecoder = useJwtDecoder();
  const accessTokenGetter = useAccessToken();

  return () => {
    return jwtDecoder<{ pId: string }>(accessTokenGetter()).pId;
  }
}

export const useAccessToken = (): () => string => {
  const profileContext = useContext(ProfileDataContext);

  return () => {
    const accessToken: string | undefined = profileContext.data?.().accessToken;

    if (!accessToken) {
      throw new Error('not access token');
    }

    return accessToken;
  }

}
