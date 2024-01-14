import styles from "./profile.page.styles.module.css";
import {InputComponent} from "../../../../components/input/input.component.tsx";
import {useEffect, useState} from "react";
import {
  getOwnProfileDataApi,
  GetProfileDataResponseDto
} from "../../../../api/get-own-profile-data/get-own-profile-data.api.ts";
import {useAccessToken} from "../../../../hooks/utils/use-id-from-token.hook.ts";
import {LoaderComponent} from "../../../../components/loader/loader.component.tsx";
import {ButtonComponent} from "../../../../components/button/button.component.tsx";
import {useNavigate} from "react-router-dom";
import {useApi} from "../../../../hooks/utils/use-api.hook.ts";
import {useLogout} from "../../../../hooks/utils/logout.hool.ts";

export const ProfilePage = () => {
  const accessTokenGetter = useAccessToken();
  const navigator = useNavigate();
  const api = useApi();
  const logout = useLogout();
  const [profileData, setProfileData] = useState<GetProfileDataResponseDto | null>(null);

  const [isLoading, setLoading] = useState(true);

  const navigateToDriverSettings = () => {
    navigator('/cabinet/profile/driver');
  }

  const logoutHandle = () => {
    logout();
  }

  useEffect(() => {
    api<GetProfileDataResponseDto>(() => getOwnProfileDataApi(accessTokenGetter()))
      .then((value) => {
        setProfileData(value);
      })
      .finally(() => setLoading(false))
  }, []);

  if (isLoading) {
    return <div className={styles.loader}>
      <LoaderComponent />
    </div>
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.inputs}>
        <div className={styles.userPropertyDiv}>
          <p className={`regularText ${styles.text}`}>Фамилия</p>
          <div>
            <InputComponent isReadonly={true} defaultText={profileData?.surname}/>
          </div>
        </div>
        <div className={styles.userPropertyDiv}>
          <p className={`regularText ${styles.text}`}>Имя</p>
          <div>
            <InputComponent isReadonly={true} defaultText={profileData?.firstname}/>
          </div>
        </div>
      </div>
      <div className={`${styles.userPropertyDiv} ${styles.btn}`}>
        <ButtonComponent title={'Водительские настройки'} onClick={navigateToDriverSettings}/>
      </div>
      <div className={`${styles.userPropertyDiv} ${styles.btn}`}>
        <ButtonComponent title={'Выйти'} onClick={logoutHandle}/>
      </div>
    </div>
  );
};
