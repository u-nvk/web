export interface GetTransportsResponseDto {
  transports: {
    id: string;
    name: string;
    plateNumber: string;
    color: string;
  }[];
}

export const getTransports = async (accessToken: string) => {
  const res = await fetch(
    "https://urfu-nvk.ru/profile/api/v1/data/transports",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    }
  );
  const responseDto: GetTransportsResponseDto = await res.json();
  return responseDto;
};
