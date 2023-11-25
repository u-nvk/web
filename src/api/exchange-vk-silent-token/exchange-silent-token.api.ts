interface ExchangeVkTokenResponseDto {
  accessToken: string;
}

export const exchangeVkSilentTokenApi = (
  vkToken: string,
  vkUUID: string,
  firstname: string,
  lastname: string
): Promise<{ accessToken: string }> => {
  return fetch("https://urfu-nvk.ru/identity/api/v1/exchange-vk-token", {
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
  })
    .then((res) => res.json())
    .then((responseDto: ExchangeVkTokenResponseDto) => responseDto);
};
