import { Link, useNavigate } from "react-router-dom";
import { OneOrderComponent } from "./components/one-order/one-order.component";
import styles from "./styles/orders.page.styles.module.css";
import { useEffect, useState } from "react";
import {
  ChipsComponent,
  IChip,
} from "../../../../components/chips/chips.component.tsx";
import { getOrders, GetOrdersResponseDto } from "../../../../api";
import {
  useAccessToken,
  useIdFromToken,
} from "../../../../hooks/utils/use-id-from-token.hook.ts";
import { formatTimePipe } from "../../../../pipes/format-time.pipe.ts";
import { formatRoutePipe } from "../../../../pipes/format-route.pipe.ts";
import {
  formatDateMonthTextPipe,
  formatDatePipe,
} from "../../../../pipes/format-date.pipe.ts";
import {
  getOwnProfileDataApi,
  GetProfileDataResponseDto,
} from "../../../../api/get-own-profile-data/get-own-profile-data.api.ts";
import { ButtonComponent } from "../../../../components/button/button.component.tsx";
import { useApi } from "../../../../hooks/utils/use-api.hook.ts";
import { LoaderComponent } from "../../../../components/loader/loader.component.tsx";

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

export const OrdersPage = () => {
  const accessTokenGetter = useAccessToken();
  const userPidGetter = useIdFromToken();
  const navigate = useNavigate();
  const api = useApi();
  const [direction, setDirection] = useState<IChip>(defaultDirections[0]);
  const [orders, setOrders] = useState<GetOrdersResponseDto["orders"]>([]);
  const [visibleOrders, setVisibleOrders] = useState<
    Map<string, GetOrdersResponseDto["orders"]>
  >(new Map());
  const [isDriver, setIsDriver] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const handleDirectionChange = (id: string) => {
    const targetDirection: IChip | undefined = defaultDirections.find(
      (dir) => dir.id === id
    );

    if (!targetDirection) {
      throw new Error("Not found selected direction");
    }

    setDirection(targetDirection);
    sortVisibleList(targetDirection, orders);
  };

  const sortVisibleList = (
    direction: IChip,
    orders: GetOrdersResponseDto["orders"]
  ) => {
    const filteredList: GetOrdersResponseDto["orders"] = orders
      .filter((order) => {
        if (direction.id === "1") {
          return order.route.to === "NVK";
        } else {
          return order.route.from === "NVK";
        }
      })
      .filter(
        (item) =>
          item.leftCount > 0 ||
          isUserJoin(item.participantIds) ||
          isUserDriver(item.driverPid)
      );

    const resultMap: Map<string, GetOrdersResponseDto["orders"]> = new Map();

    filteredList.forEach((item) => {
      const formattedDate: string = formatDatePipe(item.timeStart);
      if (resultMap.has(formattedDate)) {
        resultMap.set(formattedDate, [
          ...(resultMap.get(formattedDate) as GetOrdersResponseDto["orders"]),
          item,
        ]);
      } else {
        resultMap.set(formattedDate, [item]);
      }
    });

    setVisibleOrders(resultMap);
  };

  const getAllOrders = async () => {
    const orders = await api<GetOrdersResponseDto>(() =>
      getOrders(accessTokenGetter())
    );
    setOrders(orders.orders);
    sortVisibleList(direction, orders.orders);
    setLoading(false);
  };

  const isUserJoin = (participantIds: string[]) => {
    return participantIds.includes(userPidGetter());
  };

  const isUserDriver = (driverPid: string) => driverPid === userPidGetter();

  const navigateToCreateOrder = () => {
    navigate("/cabinet/orders/create");
  };

  useEffect(() => {
    setLoading(true);
    getAllOrders();
    api<GetProfileDataResponseDto>(() =>
      getOwnProfileDataApi(accessTokenGetter())
    ).then((res) => setIsDriver(res.isDriver));
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className={styles.mainDiv}>
      <ChipsComponent
        items={defaultDirections}
        onItemClick={handleDirectionChange}
      />
      {isDriver && (
        <div
          className={`${styles.createOrderBtn}`}
          style={{ marginTop: "15px" }}
        >
          <ButtonComponent
            title={"Добавить"}
            onClick={() => (
              ym(96148686, "reachGoal", "btn-orders-create-view"),
              navigateToCreateOrder()
            )}
          />
        </div>
      )}
      <div style={{ marginTop: "25px" }}>
        {Array.from(visibleOrders.values()).map((group, externalIndex) => {
          return (
            <div className={styles.group} key={externalIndex}>
              <div className={`boldText ${styles.dateHeading}`}>
                {formatDateMonthTextPipe(group[0].timeStart)}
              </div>
              {group.map(
                (order: GetOrdersResponseDto["orders"][number], innerIndex) => {
                  return (
                    <Link
                      key={`${externalIndex}-${innerIndex}`}
                      to={order.id}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <OneOrderComponent
                        route={`${formatRoutePipe(
                          order.route.from
                        )} -> ${formatRoutePipe(order.route.to)}`}
                        departureTimeShort={formatTimePipe(
                          order.timeStart,
                          true
                        )}
                        price={"" + order.price}
                        emptySeat={order.leftCount}
                        isUserJoin={isUserJoin(order.participantIds)}
                        isUserDriver={isUserDriver(order.driverPid)}
                      />
                    </Link>
                  );
                }
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
