import error from "/error.svg?Url"
import styles from "./error-banner.component.styles.module.css";

export const ErrorBannerComponent = () => {
  return <div className={styles.container}>
    <img src={error} className={styles.imgContainer} alt={'Ошибка'}/>
    <span className={`regularText ${styles.text}`}>Произошла ошибка</span>
  </div>
}
