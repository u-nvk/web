import styles from "./driver.page.styles.module.css";
import {InputComponent} from "../../../../../../components/input/input.component.tsx";
import Select from "react-select";
import {useAccessToken} from "../../../../../../hooks/utils/use-id-from-token.hook.ts";
import {useEffect, useState} from "react";
import {
  getOwnProfileDataApi,
} from "../../../../../../api/get-own-profile-data/get-own-profile-data.api.ts";
import {getTransports, GetTransportsResponseDto} from "../../../../../../api/get-transports/get-transports.api.ts";
import {LoaderComponent} from "../../../../../../components/loader/loader.component.tsx";
import {ErrorBannerComponent} from "../../../../../../components/error-banner/error-banner.component.tsx";
import {ButtonComponent} from "../../../../../../components/button/button.component.tsx";
import {setProfileDataApi} from "../../../../../../api/set-profile-data/set-profile-data.api.ts";
import {bindTransportApi} from "../../../../../../api/bind-transport/bind-transport.api.ts";

const bankOptions = [
  { value: '0', label: 'Сбербанк' },
  { value: '1', label: 'Тинькофф' },
  { value: '2', label: 'Альфа' },
];

const mapNumberToBankOptions = (num: number): { value: string, label: string } => {
  switch (num) {
    case 0:
      return bankOptions[0];
    case 1:
      return bankOptions[1];
    case 2:
      return bankOptions[2];
    default:
      return bankOptions[0];
  }
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "10px",
  }),
};

export const DriverPage = () => {
  const accessTokenGetter = useAccessToken();
  const [isPaymentInfoAlreadyExist, setPaymentInfoAlreadyExist] = useState(false);
  const [isTransportAlredyExist, setTransportAlreadyExist] = useState(false);

  const [phoneToTransfer, setPhoneToTransfer] = useState<string | null>(null);
  const [bank, setBank] = useState(0);
  const [transport, setTransport] = useState<Partial<GetTransportsResponseDto['transports'][number]>>({})

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    initComponent();
  }, []);

  const initComponent = async () => {
    Promise.all([
      getOwnProfileDataApi(accessTokenGetter())
        .then((value) => {
          if (value.payments && value.payments.length) {
            setBank(value.payments?.[0]?.bank);
            setPhoneToTransfer(value.payments?.[0].phone);
            setPaymentInfoAlreadyExist(true);
          }
        }),
      getTransports(accessTokenGetter())
        .then((value) => {
          if (value.transports.length) {
            setTransportAlreadyExist(true);
            setTransport({
              name: value.transports[0].name,
              color: value.transports[0].color,
              plateNumber: value.transports[0].plateNumber,
            })
          }
        })
    ])
      .catch((e) => {
        console.log(e);
        setError(true);
      })
      .finally(() => setLoading(false))
  }

  const onTransportSettingsChange = (type: 'name' | 'color' | 'plateNumber', value: string) => {
    setTransport((curr) => {
      if (type === 'plateNumber') {
        curr[type] = value.toUpperCase();
      } else {
        curr[type] = value;
      }
      return curr;
    })
  }

  const saveState = async () => {
    setLoading(true);
    if (!isPaymentInfoAlreadyExist) {
      const phoneValue: string | null = phoneToTransfer;

      if (!phoneValue) {
        setError(true);
        return;
      }

      try {
        await setProfileDataApi(accessTokenGetter(), {
          paymentMethods: [{ phone: phoneValue, bank }],
          isDriver: true,
        })
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }

    if (!isTransportAlredyExist) {
      if (!transport.name || !transport.color || !transport.plateNumber) {
        setError(true);
        return;
      }

      try {
        await bindTransportApi(accessTokenGetter(), {
          name: transport.name,
          color: transport.color,
          plateNumber: transport.plateNumber,
        })
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }
    await initComponent();
    setLoading(false);
  }

  if (isLoading) {
    return <div><LoaderComponent /></div>
  }

  if (isError) {
    return <div><ErrorBannerComponent /></div>
  }

  return (
    <div className={styles.mainDiv}>
      <div>
        <h3 className={`boldText`}>Оплата</h3>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Номер для перевода</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={setPhoneToTransfer} isReadonly={isPaymentInfoAlreadyExist} maxLength={11}
                            defaultText={phoneToTransfer ?? '7'} isNumberOnyl={true}/>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Банк</p>
          <div className={styles.userPropertyValueDiv}>
            <Select
              isDisabled={isPaymentInfoAlreadyExist}
              options={bankOptions}
              styles={customStyles}
              placeholder="Выберите банк"
              className="regularText"
              defaultValue={mapNumberToBankOptions(bank)}
              onChange={(value) => setBank(parseInt(value?.value ?? '0'))}
              isSearchable={false}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.nextH}`}>
        <h3 className={`boldText`}>Автомобиль</h3>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Марка и модель</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={onTransportSettingsChange.bind(this, 'name')} isReadonly={isTransportAlredyExist}
                            defaultText={transport.name ?? ''} isNumberOnyl={false}/>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Цвет</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={onTransportSettingsChange.bind(this, 'color')} isReadonly={isTransportAlredyExist}
                            defaultText={transport.color ?? ''} isNumberOnyl={false}/>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Гос. номер (русскими буквами, с регионом)</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={onTransportSettingsChange.bind(this, 'plateNumber')} isReadonly={isTransportAlredyExist}
                            defaultText={transport.plateNumber ?? ''} isNumberOnyl={false}/>
          </div>
        </div>
      </div>
      <div>
        {!isTransportAlredyExist && isPaymentInfoAlreadyExist && <ButtonComponent title={'Сохранить настройки транспорта'} onClick={saveState} />}
        {isTransportAlredyExist && !isPaymentInfoAlreadyExist && <ButtonComponent title={'Сохранить настройки оплаты'} onClick={saveState} />}
        {!isTransportAlredyExist && !isPaymentInfoAlreadyExist && <ButtonComponent title={'Сохранить все настройки'} onClick={saveState} />}
      </div>
    </div>
  )
}
