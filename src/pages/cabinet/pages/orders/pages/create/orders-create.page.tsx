import { ChangeEvent, useEffect, useState } from "react";
import {
  ChipsComponent,
  IChip,
} from "../../../../../../components/chips/chips.component";
import styles from "./styles/orders-create.page.module.css";
import Select, { SingleValue } from "react-select";
import RadioButtons, {
  RadioButtonOption,
} from "../../../../../../components/radioButtons/radioButtons.component";
import { useAccessToken } from "../../../../../../hooks/utils/use-id-from-token.hook";
import {
  getTransports,
  GetTransportsResponseDto,
} from "../../../../../../api/get-transports/get-transports.api";
import {
  createOrderApi,
  PostCreateOrderRequestDto,
} from "../../../../../../api/create-order/create-order.api.ts";
import { useNavigate } from "react-router-dom";
import { LoaderComponent } from "../../../../../../components/loader/loader.component.tsx";
import { ErrorBannerComponent } from "../../../../../../components/error-banner/error-banner.component.tsx";
// @ts-ignore
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"; // the locale you want
import { useApi } from "../../../../../../hooks/utils/use-api.hook.ts";
import toast from "react-hot-toast";
import { InputComponent } from "../../../../../../components/input/input.component.tsx";
import {defaultPlaces} from "../../../../../../pipes/format-route.pipe.ts";

registerLocale("ru", ru); // register it with the name you want

type IPlace = {
  value: string;
  label: string;
};

type ITransport = {
  value: string;
  label: string;
};

const toNvkId: string = "to-nvk";
const fromNvkId: string = "from-nvk";
type CustomChip = IChip & { value: string };
const defaultDirections: CustomChip[] = [
  {
    id: toNvkId,
    title: "В кампус",
    value: "NVK",
  },
  {
    id: fromNvkId,
    title: "Из кампуса",
    value: "NVK",
  },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "10px",
    backgroundColor: "var(--bg-color)",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "var(--bg-color)",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "var(--text-color)",
  }),
  option: (provided: any) => ({
    ...provided,
    color: "var(--text-color)",
    backgroundColor: "var(--bg-color)",
  }),
};

export const OrdersCreatePage = () => {
  const accessTokenGetter = useAccessToken();
  const navigate = useNavigate();
  const api = useApi();

  const [direction, setDirection] = useState<CustomChip>(defaultDirections[0]);
  const [price, setPrice] = useState<number | null>(null);
  const [secondDirection, setSecondDirection] = useState<SingleValue<IPlace>>(
    defaultPlaces[0]
  );
  const [transports, setTransports] = useState<ITransport[]>();
  const [comment, setComment] = useState<string | null>(null);
  const [selectedTransport, setSelectedTransport] =
    useState<ITransport | null>();
  const startFreeSeatCountOptions: RadioButtonOption[] = new Array(6)
    .fill(0)
    .map((_, idx) => ({ value: `${idx + 1}`, name: `${idx + 1}` }));
  const [startFreeSeatCount, setStartFreeSeatCount] = useState<number>(
    parseInt(startFreeSeatCountOptions[0].value)
  );
  const [startDate, setStartDate] = useState(new Date());

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [isErrorAfterCreating, setErrorAfterCreating] = useState(false);

  const handleDirectionChange = (id: string) => {
    const targetDirection = defaultDirections.find((dir) => dir.id === id);
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
    if (!price) {
      toast.error("Укажите стоимость поездки");
      return;
    }

    if (!selectedTransport?.value) {
      toast.error("Укажите транспорт");
      return;
    }

    if (!secondDirection?.value) {
      toast.error("Укажите направление");
      return;
    }

    // 1 мин = 600000 мс
    if (startDate.getTime() <= new Date().getTime() + 600000) {
      toast.error("Время отправления должно быть минимум через 10 минут");
      return;
    }

    const requestData: PostCreateOrderRequestDto = {
      route: {
        from: direction.id === fromNvkId ? "NVK" : secondDirection?.value,
        to: direction.id === toNvkId ? "NVK" : secondDirection?.value,
      },
      price: price,
      comment: comment ?? "",
      transportId: selectedTransport?.value,
      startFreeSeatCount: startFreeSeatCount,
      timeStart: startDate.toISOString(),
    };

    setLoading(true);
    api<{ id: string }>(() => createOrderApi(accessTokenGetter(), requestData))
      .then((res) => {
        navigate("/cabinet/orders/" + res.id);
      })
      .catch(() => setErrorAfterCreating(true))
      .finally(() => setLoading(false));
  };

  const getAllTransports = async () => {
    try {
      const transports = await api<GetTransportsResponseDto>(() =>
        getTransports(accessTokenGetter())
      );
      setTransports(
        transports.transports.map((t) => {
          return {
            label: `${t.name} (${t.color}), ${t.plateNumber}`,
            value: t.id,
          };
        })
      );
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
    return (
      <div className={styles.loaderWrapper}>
        <LoaderComponent showAfterMS={1000} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.loaderWrapper}>
        <ErrorBannerComponent />
      </div>
    );
  }

  if (isErrorAfterCreating) {
    return (
      <div className={styles.loaderWrapper}>
        <ErrorBannerComponent />
      </div>
    );
  }

  const handleBackButtonClick = () => {
    if (history.length > 2) {
      history.back();
    } else {
      navigate("/cabinet/orders");
    }
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.wrapperBackArrow}>
        <div className={styles.backArrow} onClick={handleBackButtonClick}>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M6 12L11 7M6 12L11 17"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
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
            <span className={`regularText ${styles.text}`}>
              {direction.id === fromNvkId ? "Куда" : "Откуда"}
            </span>
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
            <span className={`regularText ${styles.text}`}>
              Уточнение адреса (если нужно)
            </span>
            <div className={styles.controlDiv}>
              <InputComponent
                maxLength={200}
                isBorder={true}
                onChange={setComment}
                isReadonly={false}
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
            <span className={`regularText ${styles.text}`}>
              Количество свободных мест
            </span>
            <div className={styles.controlDiv}>
              <RadioButtons
                options={startFreeSeatCountOptions}
                setValue={(option) =>
                  setStartFreeSeatCount(parseInt(option.value))
                }
              />
            </div>
          </div>
          <div className={styles.propertyDiv}>
            <span className={`regularText ${styles.text}`}>
              Стоимость с человека
            </span>
            <div className={styles.controlDiv}>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  pattern="\d*"
                  className={styles.rubleInput}
                  value={price ?? ""}
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
                  locale="ru"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  minDate={new Date()}
                  showTimeSelect
                  dateFormat="Pp"
                  style={{ backgroundColor: "var(--bg-color)" }}
                  timeIntervals={10}
                  customInput={
                    <input className={styles.rubleInput} type="text" />
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.wrapperBtn}
          onClick={() => {
            ym(96148686, "reachGoal", "btn-orders-create"), saveOrder();
          }}
        >
          <span className={`regularText ${styles.text}`}>Опубликовать</span>
        </div>
      </div>
    </div>
  );
};
