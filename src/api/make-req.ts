import {UnauthError} from "./unauth.error.ts";

export const makeReq = async <Res>(url: string, options: RequestInit): Promise<Res> => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    throw new UnauthError()
  }

  if (res.status === 500) {
    throw new Error();
  }

  const responseDto = await res.json();
  return responseDto;
}
