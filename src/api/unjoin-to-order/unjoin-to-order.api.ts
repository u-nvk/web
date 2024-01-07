import {makeReq} from "../make-req.ts";

export const unjoinToOrderApi = async (accessToken: string, orderId: string) => {
  await makeReq(`https://urfu-nvk.ru/order/api/v1/order/${orderId}/participants`, {
    method: "DELETE",
    headers: {
      // "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
  });

  return true;
}
