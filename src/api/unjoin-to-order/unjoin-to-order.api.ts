export const unjoinToOrderApi = async (accessToken: string, orderId: string) => {
  await fetch(`https://urfu-nvk.ru/order/api/v1/order/${orderId}/participants`, {
    method: "DELETE",
    headers: {
      // "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
  });

  return true;
}
