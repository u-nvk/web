import {makeReq} from "../make-req.ts";

export interface GetTransportsResponseDto {
  transports: GetTransportsItemResponseDto[];
}

export interface GetTransportsItemResponseDto {
  id: string;
  name: string;
  plateNumber: string;
  color: string;
}

export const getTransports = async (accessToken: string) => {
  const res = await makeReq<GetTransportsResponseDto>(
    "https://urfu-nvk.ru/profile/api/v1/data/transports",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    }
  );

  return res;
};
