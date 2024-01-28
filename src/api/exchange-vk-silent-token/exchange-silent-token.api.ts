import {makeReq} from "../make-req.ts";

interface ExchangeVkTokenResponseDto {
  accessToken: string;
}

export const exchangeVkSilentTokenApi = async (
  vkToken: string,
  vkUUID: string,
  firstname: string,
  lastname: string
): Promise<{ accessToken: string }> => {
  const res = await makeReq<ExchangeVkTokenResponseDto>("identity/api/v1/exchange-vk-token", {
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

  return res;
};
