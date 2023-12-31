import styles from "./styles/one-order.component.module.css";

type RouteProps = {
  route: string;
  departureTimeShort: string;
  price: string;
  emptySeat: number;
};
export const OneOrderComponent = ({
  route,
  departureTimeShort,
  price,
  emptySeat,
}: RouteProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.directionContainer}>
        <p className={`${styles.directionText} mediumText`}>{route}</p>
      </div>
      <div className={styles.infoContainer}>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivFirst}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={`${styles.orderInfoElementDescription} lightText`}>
              отправление
            </p>
            <p className={`${styles.orderInfoElementValue} mediumText`}>
              {departureTimeShort}
            </p>
          </div>
        </div>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivSecond}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={`${styles.orderInfoElementDescription} lightText`}>
              стоимость
            </p>
            <p className={`${styles.orderInfoElementValue} mediumText`}>
              {price}₽
            </p>
          </div>
        </div>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivThird}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={`${styles.orderInfoElementDescription} lightText`}>
              свободно
            </p>
            <p className={`${styles.orderInfoElementValue} mediumText`}>
              {emptySeat}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
