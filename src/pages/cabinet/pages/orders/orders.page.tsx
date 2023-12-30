import { Link } from "react-router-dom";
import { OneOrderComponent } from "./components/one-order/one-order.component";
import styles from "./styles/orders.page.styles.module.css";
import {useEffect, useState} from "react";
import {ChipsComponent, IChip} from "../../../../components/chips/chips.component.tsx";
import {getOrders, GetOrdersResponseDto} from "../../../../api";
import {useAccessToken, useIdFromToken} from "../../../../hooks/utils/use-id-from-token.hook.ts";

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
  const [direction, setDirection] = useState<IChip>(defaultDirections[0]);
  const [orders, setOrders] = useState<GetOrdersResponseDto['orders']>([]);
  const [visibleOrders, setVisibleOrders] = useState<GetOrdersResponseDto['orders']>([]);

  const handleDirectionChange = (id: string) => {
    const targetDirection = defaultDirections.find((dir) => dir.id === id);

    if (!targetDirection) {
      throw new Error('Not found selected direction');
    }

    setDirection(targetDirection);
  }

  const getAllOrders = async () => {
    const orders = await getOrders(accessTokenGetter());
    setOrders(orders.orders);
  }

  useEffect(() => {
    getAllOrders()
      .then(() => {
        setVisibleOrders(orders.filter((order) => {
          if (direction.id === '1') {
            return order.route.to === 'NVK'
          } else {
            return order.route.from === 'NVK';
          }
        }))
      })
  }, []);

  return (
    <div className={styles.mainDiv}>
      <ChipsComponent items={defaultDirections} onItemClick={handleDirectionChange} />
      <div style={{ marginTop: "25px" }}>
        {visibleOrders.map((e, index) => (
          <Link
            to={"1"}
            key={index}
            style={{ textDecoration: "none", color: "black" }}
          >
            <OneOrderComponent
              route={"Кампус -> Розы Люксембург 49"}
              departureTime="21:18"
              price="100"
              emptySeat={2}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
