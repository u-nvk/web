import {makeReq} from "../make-req.ts";

export const declineOrderApi = async (accessToken: string, orderId: string) => {
  const res = await makeReq(`order/api/v1/order/${orderId}/decline`, {
    method: "PUT",
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  });

  return res;
}
