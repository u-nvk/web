interface ExchangeVkTokenResponseDto {
  accessToken: string;
}

export const exchangeVkSilentTokenApi = async (
  vkToken: string,
  vkUUID: string,
  firstname: string,
  lastname: string
): Promise<{ accessToken: string }> => {
  const res = await fetch("https://urfu-nvk.ru/identity/api/v1/exchange-vk-token", {
    method: "POST",
    body: JSON.stringify({
      vkToken: vkToken,
      vkUuid: vkUUID,
      firstname: firstname,
      lastname: lastname,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseDto: ExchangeVkTokenResponseDto = await res.json();
  return responseDto;
};
