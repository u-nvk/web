import { Link } from "react-router-dom";
import {HistoryPageComponent} from "../history/components/history.page.component.tsx";
import styles from "../orders/styles/orders.page.styles.module.css";
import {useEffect, useState} from "react";
import {ChipsComponent, IChip} from "../../../../components/chips/chips.component.tsx";
import {getOrders, GetOrdersResponseDto} from "../../../../api/index.ts";
import {useAccessToken, useIdFromToken} from "../../../../hooks/utils/use-id-from-token.hook.ts";
import {formatTimePipe} from "../../../../pipes/format-time.pipe.ts";
import {formatRoutePipe} from "../../../../pipes/format-route.pipe.ts";
import {formatDateMonthTextPipe, formatDatePipe} from "../../../../pipes/format-date.pipe.ts";

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

export const HistoryPage = () => {
  const accessTokenGetter = useAccessToken();
  const userPidGetter = useIdFromToken();
  const [direction, setDirection] = useState<IChip>(defaultDirections[0]);
  const [orders, setOrders] = useState<GetOrdersResponseDto['orders']>([]);
  const [visibleOrders, setVisibleOrders] = useState<Map<string, GetOrdersResponseDto['orders']>>(new Map())

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

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className={styles.mainDiv}>
      <ChipsComponent items={defaultDirections} onItemClick={handleDirectionChange} />
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
                      <HistoryPageComponent
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
