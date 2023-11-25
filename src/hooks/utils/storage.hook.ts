import { StorageKey } from "../../enums";

export const useStorage = () => {
  return {
    read: (key: StorageKey) => localStorage.getItem(key),
    write: (key: StorageKey, value: string) => localStorage.setItem(key, value),
  };
};
