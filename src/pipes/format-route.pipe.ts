export const formatRoutePipe = (route: string): string => {
  if (route === 'NVK') {
    return 'Новокольцово';
  }

  const target = defaultPlaces.find((ite) => ite.value === route);

  return target?.label ?? route;
}

export type IPlace = {
  value: string;
  label: string;
};

export const defaultPlaces: IPlace[] = [
  { value: "MUB", label: "ГУК" },
  { value: "D11", label: "Общежитие №11" },
  { value: "G8M", label: "Гринвич со стороны 8 марта" },
  { value: "UGI", label: "УГИ" },
  { value: "BT", label: "Метро Ботаническая" },
  { value: "RTF", label: "ИРИТ-РТФ" },
  { value: "RV", label: "ЖД Вокзал" },
  { value: "AR", label: "Екатеринбург-Арена" },
  { value: "INEU", label: "Корпус ИНЭУ, Гоголя 25" },
  { value: "IENIM", label: "Корпус ИЕНиМ, Куйбышева 48" },
  { value: "VZ", label: "ВИЗ" },
  { value: "UM", label: "Уралмаш" },
  { value: "YV", label: "Южный автовокзал" },
  { value: "VTOR", label: "Вторчермет" },
  { value: "D3", label: "Общежитие №3" }
];
