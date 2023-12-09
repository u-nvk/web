import styles from "./profile.page.styles.module.css";

export const ProfilePage = () => {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.userPropertyDiv}>
        <p className="mediumText">Фамилия</p>
        <div className={styles.userPropertyValueDiv}>
          <p className="regularText">Ермолаев</p>
        </div>
      </div>
      <div className={styles.userPropertyDiv}>
        <p className="mediumText">Имя</p>
        <div className={styles.userPropertyValueDiv}>
          <p className="regularText">Илья</p>
        </div>
      </div>
      <div className={styles.driverDiv}>
        <p className="boldText">Для водителей</p>
        <div className={styles.userPropertyDiv}>
          <p className="mediumText">Номер для перевода</p>
          <div className={styles.userPropertyValueDiv}>
            <p className="regularText">+79122602002</p>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className="mediumText">Банк</p>
          <div className={styles.userPropertyValueDiv}>
            <p className="regularText">Сбербанк</p>
          </div>
        </div>
      </div>
    </div>
  );
};
