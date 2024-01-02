import { useEffect, useState } from "react";
import {
  ChipsComponent,
  IChip,
} from "../../../../../../components/chips/chips.component";
import styles from "./styles/orders-create.page.module.css";
import Select, { SingleValue } from "react-select";
import RadioButtons from "../../../../../../components/radioButtons/radioButtons.component";
import { useAccessToken } from "../../../../../../hooks/utils/use-id-from-token.hook";
import {
  GetTransportsResponseDto,
  getTransports,
} from "../../../../../../api/get-transports/get-transports.api";

type IPlace = {
  value: string;
  label: string;
};
export const OrdersCreatePage = () => {
  const defaultDirections: IChip[] = [
    {
      id: "1",
      title: "В кампус",
    },
    {
      id: "2",
      title: "Из кампуса",
    },
  ];

  const defaultPlaces: IPlace[] = [
    { value: "ГУК", label: "ГУК" },
    { value: "Общежития", label: "Общежития" },
    { value: "Гринвич", label: "Гринвич" },
    { value: "Вторчермет", label: "Вторчермет" },
    { value: "Ботаника", label: "Ботаника" },
  ];

  const accessTokenGetter = useAccessToken();
  const [direction, setDirection] = useState<IChip>(defaultDirections[0]);
  const [price, setPrice] = useState<number | string>("");
  const [places, setPlaces] = useState<SingleValue<IPlace>>(defaultPlaces[0]);
  const [transports, setTransports] = useState<
    GetTransportsResponseDto["transports"]
  >([]);
  const [availableSeats, setAvailableSeats] = useState<number>(1);

  const handleDirectionChange = (id: string) => {
    const targetDirection: IChip | undefined = defaultDirections.find(
      (dir) => dir.id === id
    );
    if (!targetDirection) {
      throw new Error("Not found selected direction");
    }
    setDirection(targetDirection);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 5) {
      setPrice(Number(event.target.value));
    }
    if (event.target.value.length == 0) {
      setPrice("");
    }
  };

  const handleSelectChange = (selectedOption: SingleValue<IPlace>) => {
    setPlaces(selectedOption);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "10px",
    }),
  };

  const getAllTransports = async () => {
    const transports = await getTransports(accessTokenGetter());
    setTransports(transports.transports);
  };

  useEffect(() => {
    getAllTransports();
  }, []);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.infoAndButtonDiv}>
        <div>
          <div className={styles.propertyDiv}>
            <p className="regularText">Направление</p>
            <div className={styles.controlDiv}>
              <ChipsComponent
                items={defaultDirections}
                onItemClick={handleDirectionChange}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <p className="regularText">Откуда</p>
            <div className={styles.controlDiv}>
              <Select
                options={defaultPlaces}
                value={places}
                styles={customStyles}
                placeholder="Выберите место выезда"
                className="regularText"
                onChange={(e) => handleSelectChange(e)}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <p className="regularText">Машина</p>
            <div className={styles.controlDiv}>
              <Select
                options={defaultPlaces}
                styles={customStyles}
                placeholder="Выберите машину"
                className="regularText"
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <p className="regularText">Количество свободных мест</p>
            <div className={styles.controlDiv}>
              <RadioButtons
                selectedValue={availableSeats}
                setSelectedValue={setAvailableSeats}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <p className="regularText">Стоимость</p>
            <div className={styles.controlDiv}>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  pattern="\d*"
                  className={styles.rubleInput}
                  value={price}
                  onChange={(e) => handleInputChange(e)}
                />
                <span className={`${styles.rubleSymbol} regularText`}>₽</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.wrapperBtn}>
          <span className={`regularText ${styles.text}`}>Опубликовать</span>
        </div>
      </div>
    </div>
  );
};
