import {UnauthError} from "../../api/unauth.error.ts";
import {useLogout} from "./logout.hool.ts";

export const useApi = () => {
  const logout = useLogout();

  return async <T>(req: () => Promise<unknown>): Promise<T> => {
    try {
      const result = await req();
      return result as T;
    } catch (e) {
      if (e instanceof UnauthError) {
        logout();
      }

      throw e;
    }
  }
}
