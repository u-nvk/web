import {makeReq} from "../make-req.ts";

export interface PostCreateOrderRequestDto {
  route: {
    from: string;
    to: string;
  };
  price: number;
  comment: string;
  transportId: string;
  timeStart: string;
  startFreeSeatCount: number;
}

export const createOrderApi = async (accessToken: string, data: PostCreateOrderRequestDto) => {
  const res = await makeReq<{ id: string }>("https://urfu-nvk.ru/order/api/v1/order", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  });

  return res;
}


