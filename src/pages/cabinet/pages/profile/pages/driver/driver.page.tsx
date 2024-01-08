import styles from "./driver.page.styles.module.css";
import {InputComponent} from "../../../../../../components/input/input.component.tsx";
import Select from "react-select";
import {useAccessToken} from "../../../../../../hooks/utils/use-id-from-token.hook.ts";
import {useEffect, useState} from "react";
import {
  getOwnProfileDataApi, GetProfileDataResponseDto,
} from "../../../../../../api/get-own-profile-data/get-own-profile-data.api.ts";
import {
  getTransports,
  GetTransportsItemResponseDto,
  GetTransportsResponseDto
} from "../../../../../../api/get-transports/get-transports.api.ts";
import {LoaderComponent} from "../../../../../../components/loader/loader.component.tsx";
import {ErrorBannerComponent} from "../../../../../../components/error-banner/error-banner.component.tsx";
import {ButtonComponent} from "../../../../../../components/button/button.component.tsx";
import {setProfileDataApi} from "../../../../../../api/set-profile-data/set-profile-data.api.ts";
import {bindTransportApi} from "../../../../../../api/bind-transport/bind-transport.api.ts";
import {useApi} from "../../../../../../hooks/utils/use-api.hook.ts";
import {TransportSettingsComponent} from "../../components/transport-settings/transport-settings.component.tsx";
import {markTransportAsUnactiveApi} from "../../../../../../api/bind-transport/mark-transport-as-unactive.api.ts";
import toast from "react-hot-toast";

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
  const api = useApi();

  const [isPaymentInfoAlreadyExist, setPaymentInfoAlreadyExist] = useState(false);

  const [phoneToTransfer, setPhoneToTransfer] = useState<string | null>(null);
  const [bank, setBank] = useState(0);
  const [transports, setTransports] = useState<Partial<GetTransportsResponseDto['transports']>>([])
  const [newTransports, setNewTransports] = useState<Partial<GetTransportsItemResponseDto>[]>([])

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    initComponent();
  }, []);

  const initComponent = async () => {
    setNewTransports([]);
    Promise.all([
      api<GetProfileDataResponseDto>(() => getOwnProfileDataApi(accessTokenGetter()))
        .then((value) => {
          if (value.payments && value.payments.length) {
            setBank(value.payments?.[0]?.bank);
            setPhoneToTransfer(value.payments?.[0].phone);
            setPaymentInfoAlreadyExist(true);
          }
        }),
      api<GetTransportsResponseDto>(() => getTransports(accessTokenGetter()))
        .then((value) => {
          setTransports(value.transports);
        })
    ])
      .catch((e) => {
        console.log(e);
        setError(true);
      })
      .finally(() => setLoading(false))
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
        await api(() => setProfileDataApi(accessTokenGetter(), {
          paymentMethods: [{ phone: phoneValue, bank }],
          isDriver: true,
        }))
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }
    await initComponent();
    setLoading(false);
  }

  const onTransportSave = async (transport: Omit<GetTransportsResponseDto['transports'][number], 'id'>) => {
    await api(() => bindTransportApi(accessTokenGetter(), transport))
    toast.success('Транспорт сохранен');
    await initComponent();
  }

  const onTransportDelete = async (id: string) => {
    await api(() => markTransportAsUnactiveApi(accessTokenGetter(), id))
    toast.success('Транспорт удален');
    await initComponent();
  }

  const createNewTransport = () => {
    setNewTransports([...newTransports, {}])
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
        {!isPaymentInfoAlreadyExist && <ButtonComponent title={'Сохранить настройки оплаты'} onClick={saveState} />}
      </div>
      <div className={`${styles.nextH}`}>
        <h3 className={`boldText`}>Автомобили</h3>
        {transports.map((t) => <TransportSettingsComponent key={t?.id} originTransport={t} onSave={onTransportSave} onDelete={onTransportDelete} isAlreadyExist={true} />)}
        {newTransports.map(() => <TransportSettingsComponent key={'unn'} isAlreadyExist={false} onSave={onTransportSave} onDelete={onTransportDelete} />)}
        <div>
          {newTransports.length < 1 && <div className={`${styles.nextH} ${styles.btn}`}><ButtonComponent title={'Добавить'} onClick={createNewTransport} /></div>}
        </div>
      </div>
    </div>
  )
}
