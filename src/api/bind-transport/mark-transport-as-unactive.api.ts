import {makeReq} from "../make-req.ts";

export const markTransportAsUnactiveApi = async (accessToken: string, transportId: string) => {
  await makeReq(`profile/api/v1/data/transports/${transportId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `${accessToken}`,
    }
  })

  return true;
}
