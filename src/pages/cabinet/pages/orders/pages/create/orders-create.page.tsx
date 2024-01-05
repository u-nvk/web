import {ChangeEvent, useEffect, useState} from "react";
import {
  ChipsComponent,
  IChip,
} from "../../../../../../components/chips/chips.component";
import styles from "./styles/orders-create.page.module.css";
import Select, { SingleValue } from "react-select";
import RadioButtons, {RadioButtonOption} from "../../../../../../components/radioButtons/radioButtons.component";
import { useAccessToken } from "../../../../../../hooks/utils/use-id-from-token.hook";
import {
  getTransports,
} from "../../../../../../api/get-transports/get-transports.api";
import {createOrderApi, PostCreateOrderRequestDto} from "../../../../../../api/create-order/create-order.api.ts";
import {useNavigate} from "react-router-dom";
import {LoaderComponent} from "../../../../../../components/loader/loader.component.tsx";
import {ErrorBannerComponent} from "../../../../../../components/error-banner/error-banner.component.tsx";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type IPlace = {
  value: string;
  label: string;
};

type ITransport = {
  value: string;
  label: string;
}

const toNvkId: string = 'to-nvk';
const fromNvkId: string = 'from-nvk';
type CustomChip = IChip & { value: string };
const defaultDirections: CustomChip[] = [
  {
    id: toNvkId,
    title: "В кампус",
    value: 'NVK'
  },
  {
    id: fromNvkId,
    title: "Из кампуса",
    value: 'NVK'
  },
];

const defaultPlaces: IPlace[] = [
  { value: "MUB", label: "ГУК" },
  { value: "D11", label: "Общежитие №11" },
  { value: "G8M", label: "Гринвич со стороны 8 марта" },
  // { value: "4", label: "Вторчермет" },
  // { value: "5", label: "Ботаника" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "10px",
  }),
};

export const OrdersCreatePage = () => {

  const accessTokenGetter = useAccessToken();
  const navigate = useNavigate();

  const [direction, setDirection] = useState<CustomChip>(defaultDirections[0]);
  const [price, setPrice] = useState<number | null>(null);
  const [secondDirection, setSecondDirection] = useState<SingleValue<IPlace>>(defaultPlaces[0]);
  const [transports, setTransports] = useState<ITransport[]>();
  const [selectedTransport, setSelectedTransport] = useState<ITransport | null>();
  const startFreeSeatCountOptions: RadioButtonOption[] = new Array(6).fill(0).map((_, idx) => ({ value: `${idx + 1}`, name: `${idx + 1}` }))
  const [startFreeSeatCount, setStartFreeSeatCount] = useState<number>(parseInt(startFreeSeatCountOptions[0].value));
  const [startDate, setStartDate] = useState(new Date());

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [isErrorAfterCreating, setErrorAfterCreating] = useState(false);

  const handleDirectionChange = (id: string) => {
    const targetDirection = defaultDirections.find(
      (dir) => dir.id === id
    );
    if (!targetDirection) {
      throw new Error("Not found selected direction");
    }
    setDirection(targetDirection);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 5) {
      setPrice(parseInt(event.target.value));
    }
    if (event.target.value.length == 0) {
      setPrice(null);
    }
  };

  const saveOrder = () => {
    if (price === null || !selectedTransport?.value || !secondDirection?.value) {
      throw new Error();
    }

    const requestData: PostCreateOrderRequestDto = {
      route: {
        from: direction.id === fromNvkId ? 'NVK' : secondDirection?.value,
        to: direction.id === toNvkId ? 'NVK' : secondDirection?.value
      },
      price: price,
      transportId: selectedTransport?.value,
      startFreeSeatCount: startFreeSeatCount,
      timeStart: startDate.toISOString(),
    }

    setLoading(true);
    createOrderApi(accessTokenGetter(), requestData)
      .then((res) => {
        navigate('/cabinet/orders/' + res.id);
      })
      .catch(() => setErrorAfterCreating(true))
      .finally(() => setLoading(false))
  }

  const getAllTransports = async () => {
    try {
      const transports = await getTransports(accessTokenGetter());
      setTransports(transports.transports.map((t) => {
        return {
          label: `${t.name} (${t.color}), ${t.plateNumber}`,
          value: t.id,
        }
      }));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransports();
  }, []);

  if (isLoading) {
    return <div className={styles.loaderWrapper}><LoaderComponent showAfterMS={1000} /></div>
  }

  if (isError) {
    return <div className={styles.loaderWrapper}><ErrorBannerComponent /></div>;
  }

  if (isErrorAfterCreating) {
    return <div className={styles.loaderWrapper}><ErrorBannerComponent /></div>;
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.infoAndButtonDiv}>
        <div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>Направление</span>
            <div className={styles.controlDiv}>
              <ChipsComponent
                items={defaultDirections}
                onItemClick={handleDirectionChange}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>{direction.id === fromNvkId ? 'Куда' : 'Откуда'}</span>
            <div className={styles.controlDiv}>
              <Select
                options={defaultPlaces}
                value={secondDirection}
                styles={customStyles}
                placeholder="Выберите место выезда"
                className="regularText"
                onChange={setSecondDirection}
                isSearchable={false}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>Транспорт</span>
            <div className={styles.controlDiv}>
              <Select
                options={transports}
                styles={customStyles}
                placeholder="Выберите транспорт"
                className="regularText"
                onChange={setSelectedTransport}
                isSearchable={false}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>Количество свободных мест</span>
            <div className={styles.controlDiv}>
              <RadioButtons
                options={startFreeSeatCountOptions}
                setValue={(option) => setStartFreeSeatCount(parseInt(option.value))}
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>Стоимость</span>
            <div className={styles.controlDiv}>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  pattern="\d*"
                  className={styles.rubleInput}
                  value={price ?? ''}
                  maxLength={5}
                  onChange={handlePriceChange}
                />
                <span className={`${styles.rubleSymbol} regularText`}>₽</span>
              </div>
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>Дата</span>
            <div className={styles.controlDiv}>
              <div className={styles.inputContainer}>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  timeIntervals={10}
                />
              </div>
            </div>
          </div>

        </div>
        <div className={styles.wrapperBtn}>
          <span onClick={saveOrder} className={`regularText ${styles.text}`}>Опубликовать</span>
        </div>
      </div>
    </div>
  );
};
