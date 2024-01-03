export interface GetProfileDataResponseDto {
  userId: string;
  userPid: string;
  surname: string;
  firstname: string;
  isDriver: boolean;
  payments: {
    phone: string;
    bank: number;
  }[]
}

export const getOwnProfileDataApi = async (accessToken: string) => {
  const res = await fetch("https://urfu-nvk.ru/profile/api/v1/data/user", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    },
  })

  const responseDto: GetProfileDataResponseDto = await res.json();
  return responseDto;
}
