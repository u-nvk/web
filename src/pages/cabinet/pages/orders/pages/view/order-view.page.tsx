import styles from "./styles/order-view.page.module.css";
import vkIcon from '../../../../../../icons/VK.svg';
import back from '../../../../../../icons/back.svg';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getOrderApi, GetOrderResponseDto} from "../../../../../../api/get-order/get-order.api.ts";
import {useAccessToken} from "../../../../../../hooks/utils/use-id-from-token.hook.ts";
import {formatTimePipe} from "../../../../../../pipes/format-time.pipe.ts";
import {formatDatePipe} from "../../../../../../pipes/format-date.pipe.ts";
import {formatRoutePipe} from "../../../../../../pipes/format-route.pipe.ts";

const redirectToVkById = (vkId: number): void => {
  window.open(`https://vk.com/id${vkId}`, '__blank')
}

export const OrderViewPage = () => {
  const params = useParams();
  const [order, setOrder] = useState<GetOrderResponseDto | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const accessTokenGetter = useAccessToken();

  useEffect(() => {
    getOrderApi(accessTokenGetter(), params.id as string)
      .then((data) => {
        setOrder(data);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  if (isLoading) {
    return 'Loading...';
  }

  if (order) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapperContent}>
          <div className={styles.content}>
            <div className={`${styles.contentRouteLine} ${styles.contentLine}`}>
            <span className={`mediumText ${styles.text}`}>
              {formatRoutePipe(order.route.from) + ' -> ' + formatRoutePipe(order.route.to)}
            </span>
            </div>
            <div className={`${styles.contentMainInfoLine} ${styles.contentLine}`}>
              <div>
                <div className={`lightText ${styles.littleText}`}>
                  отправление
                </div>
                <div className={`mediumText ${styles.infoText}`}>
                  {formatTimePipe(order.timeStart, true)}
                </div>
              </div>
              <div>
                <div className={`lightText ${styles.littleText}`}>
                  стоимость
                </div>
                <div className={`mediumText ${styles.infoText}`}>
                  {order.price}
                </div>
              </div>
              <div>
                <div className={`lightText ${styles.littleText}`}>
                  свободно
                </div>
                <div className={`mediumText ${styles.infoText}`}>
                  ДОПИЛИТЬ
                </div>
              </div>
            </div>
            <div className={styles.contentLine}>
              <div className={`lightText ${styles.littleText}`}>Дата</div>
              <div className={`mediumText ${styles.infoText}`}>{formatDatePipe(order.timeStart)}</div>
            </div>
            <div className={`${styles.contentLine}`}>
              <div className={`lightText ${styles.littleText}`}>водитель</div>
              <div className={`mediumText ${styles.infoText}`}>
                <span>{order.driver.firstname} {order.driver.surname} </span>
                <img src={vkIcon} onClick={() => redirectToVkById(order?.driver.vkId)}/>
              </div>
            </div>
            <div className={`${styles.contentLine}`}>
              <div className={`lightText ${styles.littleText}`}>марка и модель</div>
              <div className={`mediumText ${styles.infoText}`}>{order.transport.name}</div>
            </div>
            <div className={`${styles.contentLine}`}>
              <div className={`lightText ${styles.littleText}`}>номер</div>
              <div className={`mediumText ${styles.infoText}`}>{order.transport.plateNumber}</div>
            </div>
            <div className={`${styles.contentLine}`}>
              <div className={`lightText ${styles.littleText}`}>банк</div>
              <div className={`mediumText ${styles.infoText}`}>ДОПИЛИТЬ</div>
            </div>
          </div>
        </div>
        <div className={styles.wrapperBtn}>
          <span className={`regularText ${styles.text}`}>
            Присоединиться
          </span>
        </div>
      </div>
    )
  }

  return 'Error';
}
