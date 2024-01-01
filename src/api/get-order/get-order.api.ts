export interface GetOrderResponseDto {
  id: string;
  driverPid: string;
  price: number;
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
  const res = await fetch("https://urfu-nvk.ru/order/api/v1/order/" + orderId, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  })

  const responseDto: GetOrderResponseDto = await res.json();
  return responseDto;
}
