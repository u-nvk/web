import {makeReq} from "../make-req.ts";

export interface GetDataByUseridResponseDto {
  payments: {
    phone: string;
    bank: number;
  }[]
}

export const getProfileData = async (accessToken: string, userPid: string) => {
  const res = await makeReq<GetDataByUseridResponseDto>(`https://urfu-nvk.ru/profile/api/v1/data/user/${userPid}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  });

  return res;
}
