export interface GetHistoryOrdersResponseDto {
  list: {
    id: string;
    orderId: string;
    userPid: string;
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
) => {
  const res = await fetch("https://urfu-nvk.ru/order/api/v1/order/history", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  })
  const responseDto: GetHistoryOrdersResponseDto = await res.json();
  return responseDto;
}
