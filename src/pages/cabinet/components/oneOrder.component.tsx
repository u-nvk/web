import styles from "../styles/oneOrder.component.module.css";

export const OneOrderComponent = () => {
  return (
    <div className={styles.orderDiv}>
      <div className={styles.orderRouteNameDiv}>
        <p className={styles.orderRouteNameText}>
          Кампус --- Розы Люксембург 49
        </p>
      </div>
      <div className={styles.orderInfoDiv}>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivFirst}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={styles.orderInfoElementDescription}>отправление</p>
            <p className={styles.orderInfoElementValue}>21:18</p>
          </div>
        </div>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivSecond}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={styles.orderInfoElementDescription}>стоимость</p>
            <p className={styles.orderInfoElementValue}>100₽</p>
          </div>
        </div>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivThird}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={styles.orderInfoElementDescription}>свободно</p>
            <p className={styles.orderInfoElementValue}>2</p>
          </div>
        </div>
      </div>
    </div>
  );
};
