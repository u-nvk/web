import {Link, useNavigate} from "react-router-dom";
import { OneOrderComponent } from "./components/one-order/one-order.component";
import styles from "./styles/orders.page.styles.module.css";
import {useEffect, useState} from "react";
import {ChipsComponent, IChip} from "../../../../components/chips/chips.component.tsx";
import {getOrders, GetOrdersResponseDto} from "../../../../api";
import {useAccessToken, useIdFromToken} from "../../../../hooks/utils/use-id-from-token.hook.ts";
import {formatTimePipe} from "../../../../pipes/format-time.pipe.ts";
import {formatRoutePipe} from "../../../../pipes/format-route.pipe.ts";
import {formatDateMonthTextPipe, formatDatePipe} from "../../../../pipes/format-date.pipe.ts";
import {getOwnProfileDataApi} from "../../../../api/get-own-profile-data/get-own-profile-data.api.ts";
import {ButtonComponent} from "../../../../components/button/button.component.tsx";

const defaultDirections: IChip[] = [
  {
    id: '1',
    title: 'В кампус'
  },
  {
    id: '2',
    title: 'Из кампуса'
  }
]

export const OrdersPage = () => {
  const accessTokenGetter = useAccessToken();
  const userPidGetter = useIdFromToken();
  const navigate = useNavigate();
  const [direction, setDirection] = useState<IChip>(defaultDirections[0]);
  const [orders, setOrders] = useState<GetOrdersResponseDto['orders']>([]);
  const [visibleOrders, setVisibleOrders] = useState<Map<string, GetOrdersResponseDto['orders']>>(new Map())
  const [isDriver, setIsDriver] = useState(false);

  const handleDirectionChange = (id: string) => {
    const targetDirection: IChip | undefined = defaultDirections.find((dir) => dir.id === id);

    if (!targetDirection) {
      throw new Error('Not found selected direction');
    }

    setDirection(targetDirection);
    sortVisibleList(targetDirection);
  }

  const sortVisibleList = (direction: IChip) => {
    const filteredList: GetOrdersResponseDto['orders'] = orders.filter((order) => {
      if (direction.id === '1') {
        return order.route.to === 'NVK'
      } else {
        return order.route.from === 'NVK';
      }
    });

    const resultMap: Map<string, GetOrdersResponseDto['orders']> = new Map();

    filteredList.forEach((item) => {
      const formattedDate: string = formatDatePipe(item.timeStart);
      if (resultMap.has(formattedDate)) {
        resultMap.set(formattedDate, [...resultMap.get(formattedDate) as GetOrdersResponseDto['orders'], item]);
      } else {
        resultMap.set(formattedDate, [item]);
      }
    });

    setVisibleOrders(resultMap);
  }

  const getAllOrders = async () => {
    const orders = await getOrders(accessTokenGetter());
    setOrders(orders.orders);
    sortVisibleList(direction);
  }

  const isUserJoin = (participantIds: string[]) => {
    return participantIds.includes(userPidGetter());
  }

  const isUserDriver = (driverPid: string) => driverPid === userPidGetter();

  const navigateToCreateOrder = () => {
    navigate('/cabinet/orders/create');
  }

  useEffect(() => {
    getAllOrders();
    getOwnProfileDataApi(accessTokenGetter())
      .then((res) => setIsDriver(res.isDriver))
  }, []);

  return (
    <div className={styles.mainDiv}>
      <ChipsComponent items={defaultDirections} onItemClick={handleDirectionChange} />
      {isDriver && <div className={`${styles.createOrderBtn}`}><ButtonComponent title={'Добавить'} onClick={navigateToCreateOrder} /></div>}
      <div style={{ marginTop: "25px" }}>
        {Array.from(visibleOrders.values()).map((group, externalIndex) => {
          return (
            <div className={styles.group} key={externalIndex}>
              <div className={`boldText ${styles.dateHeading}`}>
                {formatDateMonthTextPipe(group[0].timeStart)}
              </div>
              {
                group.map((order: GetOrdersResponseDto['orders'][number], innerIndex) => {
                  return (
                    <Link
                      key={`${externalIndex}-${innerIndex}`}
                      to={order.id}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <OneOrderComponent
                        route={`${formatRoutePipe(order.route.from)} -> ${formatRoutePipe(order.route.to)}`}
                        departureTimeShort={formatTimePipe(order.timeStart, true)}
                        price={'' + order.price}
                        emptySeat={order.leftCount}
                        isUserJoin={isUserJoin(order.participantIds)}
                        isUserDriver={isUserDriver(order.driverPid)}
                      />
                    </Link>
                  )
                })
              }
            </div>
          )
        })}
      </div>
    </div>
  );
};
