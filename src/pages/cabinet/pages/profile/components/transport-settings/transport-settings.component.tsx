import styles from "./transport-settings.page.styles.module.css";
import {InputComponent} from "../../../../../../components/input/input.component.tsx";
import {FC, useState} from "react";
import {
  GetTransportsItemResponseDto,
  GetTransportsResponseDto
} from "../../../../../../api/get-transports/get-transports.api.ts";
import {ButtonComponent} from "../../../../../../components/button/button.component.tsx";
import toast from "react-hot-toast";

export interface ITransportSettings {
  isAlreadyExist: boolean;
  onSave: (transport: Omit<GetTransportsResponseDto['transports'][number], 'id'>) => void;
  onDelete: (id: string) => void;
  originTransport?: GetTransportsItemResponseDto;
}

const regexp = /^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/ui;

export const TransportSettingsComponent: FC<ITransportSettings> = ({ isAlreadyExist, onDelete, onSave, originTransport }) => {
  const [transport, setTransport] = useState<Partial<GetTransportsItemResponseDto>>(originTransport ?? {})
  const [isReadonlySaveBtn, setReadonlySaveBtn] = useState(isAlreadyExist);

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

  const onTransportDelete = async () => {
    const transportId = transport.id;

    if (!transportId) {
      return;
    }

    onDelete(transportId);
  }

  const onTransportSave = async () => {
    const name = transport.name;
    const color = transport.color;
    const plateNumber = transport.plateNumber?.toUpperCase();

    if (!name || !color || !plateNumber || !regexp.test(plateNumber)) {
      toast.error('Некорректная форма');
      return;
    }

    onSave({
      name,
      color,
      plateNumber,
    })

    setReadonlySaveBtn(true);
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Марка и модель</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={onTransportSettingsChange.bind(this, 'name')} isReadonly={isAlreadyExist}
                            defaultText={transport.name ?? ''} isNumberOnyl={false}/>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Цвет</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={onTransportSettingsChange.bind(this, 'color')} isReadonly={isAlreadyExist}
                            defaultText={transport.color ?? ''} isNumberOnyl={false}/>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className={`${styles.text} regularText`}>Гос. номер (русскими буквами, с регионом)</p>
          <div className={styles.userPropertyValueDiv}>
            <InputComponent onChange={onTransportSettingsChange.bind(this, 'plateNumber')}
                            placeholder={"Н200ВК24"}
                            isReadonly={isAlreadyExist}
                            defaultText={transport.plateNumber ?? ''} isNumberOnyl={false}/>
          </div>
        </div>
      </div>

      <div className={styles.btn}>
        {!isReadonlySaveBtn && <ButtonComponent title={"Сохранить"} onClick={onTransportSave}/>}
        {isReadonlySaveBtn && <ButtonComponent title={"Удалить"} onClick={onTransportDelete}/>}
      </div>
    </div>
  )
}
