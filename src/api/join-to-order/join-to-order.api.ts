import {makeReq} from "../make-req.ts";

export interface JoinToOrderResponseDto {
  id: string;
}

export const joinToOrderApi = async (accessToken: string, orderId: string) => {
  const res = await makeReq<JoinToOrderResponseDto>(`order/api/v1/order/${orderId}/participants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
    body: JSON.stringify({}),
  });

  return res;
}
