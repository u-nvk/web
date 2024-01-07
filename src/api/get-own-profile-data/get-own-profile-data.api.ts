import {makeReq} from "../make-req.ts";

export interface GetProfileDataResponseDto {
  userId: string;
  userPid: string;
  surname: string;
  firstname: string;
  isDriver: boolean;
  payments: {
    phone: string;
    bank: number;
  }[]
}

export const getOwnProfileDataApi = async (accessToken: string) => {
  const res = await makeReq<GetProfileDataResponseDto>("https://urfu-nvk.ru/profile/api/v1/data/user", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
  })

  return res;
}
