import {makeReq} from "../make-req.ts";

export interface PostProfileDataRequestDto {
  paymentMethods?: { phone: string, bank: number }[];
  isDriver?: boolean;
}

export const setProfileDataApi = async (accessToken: string, body: PostProfileDataRequestDto) => {
  await makeReq("profile/api/v1/data/user", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
  });

  return true;
}
