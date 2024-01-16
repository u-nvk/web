import {makeReq} from "../make-req.ts";

export interface GetOrderResponseDto {
  id: string;
  isDeclined: boolean;
  driverPid: string;
  price: number;
  comment: string;
  route: {
    from: string;
    to: string;
  },
  driver: {
    firstname: string;
    surname: string;
    vkId: number;
  },
  participants: {
    firstname: string;
    surname: string;
    vkId: number;
    pId: string;
  }[],
  transport: {
    plateNumber: string;
    color: string;
    name: string;
  },
  timeStart: string;
  leftCount: number;
}

export const getOrderApi = async (
  accessToken: string,
  orderId: string,
) => {
  const res = await makeReq<GetOrderResponseDto>("https://urfu-nvk.ru/order/api/v1/order/" + orderId, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  })

  return res;
}
