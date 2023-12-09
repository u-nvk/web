import { Link } from "react-router-dom";
import { OneOrderComponent } from "./components/one-order/one-order.component";
import styles from "./styles/orders.page.styles.module.css";

export const OrdersPage = () => {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.buttonGroup}>
        <div className={styles.oneButton}>
          <p className={styles.oneButtonText}> В кампус</p>
        </div>
        <div className={styles.oneButton}>
          <p className={styles.oneButtonText}>Из кампуса</p>
        </div>
      </div>
      <div style={{ marginTop: "25px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, index) => (
          <Link
            to={"1"}
            key={index}
            style={{ textDecoration: "none", color: "black" }}
          >
            <OneOrderComponent />
          </Link>
        ))}
      </div>
    </div>
  );
};
