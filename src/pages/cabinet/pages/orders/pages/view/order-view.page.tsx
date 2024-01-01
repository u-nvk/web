import styles from "./styles/order-view.page.module.css";
import vkIcon from '../../../../../../icons/VK.svg';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getOrderApi, GetOrderResponseDto} from "../../../../../../api/get-order/get-order.api.ts";
import {useAccessToken, useIdFromToken} from "../../../../../../hooks/utils/use-id-from-token.hook.ts";
import {formatTimePipe} from "../../../../../../pipes/format-time.pipe.ts";
import {formatDatePipe} from "../../../../../../pipes/format-date.pipe.ts";
import {formatRoutePipe} from "../../../../../../pipes/format-route.pipe.ts";
import {joinToOrderApi} from "../../../../../../api";
import {getProfileData} from "../../../../../../api/get-profile-data/get-profile-data.api.ts";
import {translateBankPipe} from "../../../../../../pipes/translate-bank.pipe.ts";
import {unjoinToOrderApi} from "../../../../../../api/unjoin-to-order/unjoin-to-order.api.ts";

const redirectToVkById = (vkId: number): void => {
  window.open(`https://vk.com/id${vkId}`, '__blank')
}

export const OrderViewPage = () => {
  const params = useParams();
  const accessTokenGetter = useAccessToken();
  const userPidGetter = useIdFromToken();
  const [order, setOrder] = useState<GetOrderResponseDto | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isErrorInRequests, setErrorInRequests] = useState(false);
  const [isErrorWhenTryJoin, setErrorWhenTryJoin] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [paymentBank, setPaymentBank] = useState<number | null>(null);
  const [isCanJoin, setCanJoin] = useState<boolean>(true);
  const [isTryJoinProcess, setTryJoinProcess] = useState<boolean>(false);

  const joinToOrder = async () => {
    if (!order) {
      throw new Error('Not order');
    }

    if (isErrorWhenTryJoin || !isCanJoin) {
      return;
    }

    setTryJoinProcess(true);

    if (isJoined) {
      try {
        await unjoinToOrderApi(accessTokenGetter(), order.id);
        initComponentData();
      } catch (e) {
        setErrorInRequests(true);
      } finally {
        setTryJoinProcess(false);
      }
    } else {
      try {
        await joinToOrderApi(accessTokenGetter(), order.id);
        initComponentData();
      } catch (e) {
        setErrorWhenTryJoin(true);
        setIsJoined(false);
      } finally {
        setTryJoinProcess(false);
      }
    }
  }

  const initComponentData = async () => {
    if (isTryJoinProcess) {
      return;
    }

    getOrderApi(accessTokenGetter(), params.id as string)
      .then((data) => {
        setOrder(data);

        const userPid = userPidGetter();

        if (data.participants.some((part) => part.pId === userPid)) {
          setIsJoined(true);
        } else {
          setIsJoined(false);
          if (data.leftCount < 1) {
            setCanJoin(false);
          } else {
            setCanJoin(true);
          }
        }

        return getProfileData(accessTokenGetter(), data.driverPid)
      })
      .then((data) => {
        if (!data.payments[0]) {
          throw new Error('Driver has not payment methods');
        }

        setPaymentBank(data.payments[0].bank);
      })
      .catch(() => {
        setErrorInRequests(true);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    initComponentData();
    setInterval(() => initComponentData(), 3000);
  }, []);

  if (isLoading) {
    return 'Loading...';
  }

  if (isErrorInRequests) {
    return 'Произошла ошибка';
  }

  if (order && typeof paymentBank === 'number') {
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
              <div className={styles.contentDateLine}>
                <div className={`lightText ${styles.littleText}`}>
                  отправление
                </div>
                <div className={`mediumText ${styles.infoText}`}>
                  {formatTimePipe(order.timeStart, true)}
                </div>
              </div>
              <div className={styles.contentDateLine}>
                <div className={`lightText ${styles.littleText}`}>
                  стоимость
                </div>
                <div className={`mediumText ${styles.infoText}`}>
                  {order.price}
                </div>
              </div>
              <div className={styles.contentDateLine}>
                <div className={`lightText ${styles.littleText}`}>
                  свободно
                </div>
                <div className={`mediumText ${styles.infoText}`}>
                  {order.leftCount}
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
              <div className={`mediumText ${styles.infoText}`}>{translateBankPipe(paymentBank)}</div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.wrapperBtn} ${!isJoined && !isErrorWhenTryJoin ? styles.wrapperBtnNotJoined : ''} ${isJoined ? styles.wrapperBtnJoined : ''} ${isErrorWhenTryJoin ? styles.wrapperBtnError : ''}`}
          onClick={joinToOrder}
        >
          {!isErrorWhenTryJoin && !isJoined && isCanJoin &&
            <span className={`regularText ${styles.text}`}>
              Присоединиться
            </span>
          }
          {isErrorWhenTryJoin && <span className={`regularText ${styles.text}`}>Произошла ошибка</span>}
          {!isErrorWhenTryJoin && isJoined &&
            <span className={`regularText ${styles.text}`}>
              Отписаться
            </span>
          }
          {!isCanJoin && !isErrorWhenTryJoin &&
            <span className={`regularText ${styles.text}`}>
              Не осталось свободных мест
            </span>
          }
        </div>
      </div>
    )
  }

  return 'Error';
}
