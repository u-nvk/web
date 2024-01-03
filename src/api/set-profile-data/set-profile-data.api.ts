export interface PostProfileDataRequestDto {
  paymentMethods?: { phone: string, bank: number }[];
  isDriver?: boolean;
}

export const setProfileDataApi = async (accessToken: string, body: PostProfileDataRequestDto) => {
  await fetch("https://urfu-nvk.ru/profile/api/v1/data/user", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
  });

  return true;
}
