import styles from "./styles/one-order.component.module.css";

export const OneOrderComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.directionContainer}>
        <p className={`${styles.directionText} mediumText`} >
          Кампус -{'>'} Розы Люксембург 49
        </p>
      </div>
      <div className={styles.infoContainer}>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivFirst}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={`${styles.orderInfoElementDescription} lightText`}>отправление</p>
            <p className={`${styles.orderInfoElementValue} mediumText`}>21:18</p>
          </div>
        </div>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivSecond}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={`${styles.orderInfoElementDescription} lightText`}>стоимость</p>
            <p className={`${styles.orderInfoElementValue} mediumText`}>100₽</p>
          </div>
        </div>
        <div
          className={`${styles.orderInfoElementDiv} ${styles.orderInfoElementDivThird}`}
        >
          <div className={styles.orderInfoElementDivText}>
            <p className={`${styles.orderInfoElementDescription} lightText`}>свободно</p>
            <p className={`${styles.orderInfoElementValue} mediumText`}>2</p>
          </div>
        </div>
      </div>
    </div>
  );
};
