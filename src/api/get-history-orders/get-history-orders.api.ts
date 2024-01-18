import {makeReq} from "../make-req.ts";

export interface GetHistoryOrdersResponseDto {
  list: {
    id: string;
    orderId: string;
    driverPid: string;
    price: number;
    timeStart: string;
    route: {
      from: string;
      to: string;
    }
  }[]
}

export const getHistoryOrders = async (
  accessToken: string,
  role: 'driver' | 'participant'
) => {
  const res = await makeReq<GetHistoryOrdersResponseDto>("https://urfu-nvk.ru/order/api/v1/order/history?" + new URLSearchParams({ role }), {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  })

  return res;
}
