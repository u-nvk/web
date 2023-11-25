export const useStorage = () => {
  return {
    read: (key: string) => localStorage.getItem(key),
    write: (key: string, value: string) => localStorage.setItem(key, value),
  };
};
