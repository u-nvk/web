export interface JoinToOrderResponseDto {
  id: string;
}

export const joinToOrderApi = async (accessToken: string, orderId: string) => {
  const res = await fetch(`https://urfu-nvk.ru/order/api/v1/order/${orderId}/participants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
    body: JSON.stringify({}),
  });
  const responseDto: JoinToOrderResponseDto = await res.json();
  return responseDto;
}
