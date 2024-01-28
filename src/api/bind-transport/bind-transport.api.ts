import {makeReq} from "../make-req.ts";

export interface PostCreateTransportRequestDto {
  name: string,
  plateNumber: string,
  color: string
}

export const bindTransportApi = async (accessToken: string, body: PostCreateTransportRequestDto) => {
  await makeReq("profile/api/v1/data/transports", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  })

  return true;
}
