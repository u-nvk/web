import {makeReq} from "../make-req.ts";

export interface GetOrdersResponseDto {
  orders: {
    id: string;
    driverPid: string;
    price: number;
    route: {
      from: string;
      to: string;
    },
    participantIds: string[],
    leftCount: number;
    timeStart: string;
  }[]
}

export const getOrders = async (
  accessToken: string,
) => {
  const res = await makeReq<GetOrdersResponseDto>("https://urfu-nvk.ru/order/api/v1/order", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  })

  return res;
}
