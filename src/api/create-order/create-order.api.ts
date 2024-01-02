export interface PostCreateOrderRequestDto {
  route: {
    from: string;
    to: string;
  };
  price: number;
  transportId: string;
  timeStart: string;
  startFreeSeatCount: number;
}

export const createOrderApi = async (accessToken: string, data: PostCreateOrderRequestDto) => {
  const res = await fetch("https://urfu-nvk.ru/order/api/v1/order", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  });

  const responseDto: { id: string } = await res.json();
  return responseDto;
}


