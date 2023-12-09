import styles from "./styles/order-view.page.module.css";
import vkIcon from '../../../../../../icons/VK.svg';

export const OrderViewPage = () => { 
  return <div className={styles.container}>
  <div className={styles.infoAndButtonView}>
    <div className={styles.infoView}>
      <div style={{marginLeft: -10, marginTop: 5, width: '100%', flex: 0.1}}>
        <p className={styles.nameText}>Розы Люксембург 49 ➙ Кампус</p>
      </div>

      <div className={styles.priceStyle}>
        <div style={{marginLeft: -10, marginTop: 20, flex: 0.33, alignItems: 'flex-start'}}>
          <div style={{alignItems: 'center'}}>
            <p className={styles.mainInfoLabel}>отправление</p>
            <p className={styles.mainInfoValue}>21:18</p>
          </div>
        </div>

        <div style={{marginTop: 20, marginLeft: 50, flex: 0.33, alignItems: 'center'}}>
          <div style={{alignItems: 'center'}}>
            <p className={styles.mainInfoLabel}>стоимость</p>
            <p className={styles.mainInfoValue}>100₽</p>
          </div>
        </div>

        <div style={{marginTop: 20, marginLeft: 50, flex: 0.33, alignItems: 'flex-end'}}>
          <div style={{alignItems: 'center'}}>
            <p className={styles.mainInfoLabel}>свободно</p>
            <p className={styles.mainInfoValue}>2</p>
          </div>
        </div>
      </div>
      <div style={{marginLeft: -10, marginTop: 35, width: '100%', flex: 0.2}}>
        <p className={styles.infoLabel}>
          водитель
        </p>
        <div
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}>
          <p className={styles.iconText}>
            Маркелов Артемий
          </p>
          <img src={vkIcon} alt="VK" />
          {/* <div className={{marginLeft: '5%'}}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://vk.com/sankok2000two')
              }>
              <FirstIcon
                name="vk-alternitive"
                size={22}
                color={'rgb(0,119,255)'}
              />
            </TouchableOpacity>
          </div> */}
        </div>
      </div>
      <div style={{marginLeft: -10, marginTop: 15, width: '100%', flex: 0.2}}>
        <p className={styles.infoLabel}>
          марка и модель
        </p>
        <p className={styles.infoValue}>
          Mercedes S, а225ло
        </p>
      </div>
      <div style={{marginLeft: -10, marginTop: 15, width: '100%', flex: 0.2}}>
        <p className={styles.infoLabel}>
          номер для перевода
        </p>
        <p className={styles.infoValue}>
          +79122602002
        </p>
      </div>
      <div style={{marginLeft: -10, marginTop: 15, width: '100%', flex: 0.2}}>
        <p className={styles.infoLabel}>банк</p>
        <p className={styles.infoValue}>
          Сбербанк
        </p>
      </div>
    </div>
    <button className={styles.buttonJoin}>Присоединиться</button>

    {/* <TouchableOpacity className={styles.buttonStyle}>
      <p className={styles.buttonText}>Присоединиться</p>
    </TouchableOpacity> */}
  </div>
</div>
}

