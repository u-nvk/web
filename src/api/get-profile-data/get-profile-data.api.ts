export interface GetDataByUseridResponseDto {
  payments: {
    phone: string;
    bank: number;
  }[]
}

export const getProfileData = async (accessToken: string, userPid: string) => {
  const res = await fetch(`https://urfu-nvk.ru/profile/api/v1/data/user/${userPid}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${accessToken}`,
    }
  });

  const responseDto: GetDataByUseridResponseDto = await res.json();
  return responseDto;
}
