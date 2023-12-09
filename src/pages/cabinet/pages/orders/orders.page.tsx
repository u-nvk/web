import { Link } from "react-router-dom";
import { OneOrderComponent } from "./components/one-order/one-order.component";
import styles from "./styles/orders.page.styles.module.css";
import { useState } from "react";

export const OrdersPage = () => {
  const [inCampus, setInCampus] = useState<boolean>(true);
  return (
    <div className={styles.mainDiv}>
      <div className={styles.buttonGroup}>
        <button
          className={inCampus ? styles.oneActiveButton : styles.oneButton}
          onClick={() => setInCampus(true)}
        >
          <p
            className={
              inCampus ? styles.oneActiveButtonText : styles.oneButtonText
            }
          >
            В кампус
          </p>
        </button>
        <button
          className={!inCampus ? styles.oneActiveButton : styles.oneButton}
          onClick={() => setInCampus(false)}
        >
          <p
            className={
              !inCampus ? styles.oneActiveButtonText : styles.oneButtonText
            }
          >
            Из кампуса
          </p>
        </button>
      </div>
      <div style={{ marginTop: "25px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, index) => (
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
