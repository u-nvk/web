import {
  Config,
  Connect,
  ConnectEvents,
  VKSilentAuthPayload,
} from "@vkontakte/superappkit";
import {useContext, useEffect, useRef, useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { exchangeVkSilentTokenApi } from "../../api";
import {
  isValidProfileData,
  ProfileDataContext,
} from "../../context/profile-data.context";
import styles from "./styles/auth.page.styles.module.css";
import {LoaderComponent} from "../../components/loader/loader.component.tsx";

const registerVkAuth = (
  placeToInsertFrame: HTMLDivElement,
  setProfileData: (accessToken: string) => void
) => {
  Config.init({
    appId: 51785691, // идентификатор приложения
  });

  const oneTapButton = Connect.buttonOneTapAuth({
    // Обязательный параметр в который нужно добавить обработчик событий приходящих из SDK
    callback: function (e) {

      const type = e.type;

      if (!type) {
        return false;
      }

      switch (type) {
        case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS: // = 'VKSDKOneTapAuthLoginSuccess'
          // eslint-disable-next-line no-case-declarations
          const payload: VKSilentAuthPayload = e.payload as VKSilentAuthPayload;

          exchangeVkSilentTokenApi(
            payload.token,
            payload.uuid,
            payload.user.first_name,
            payload.user.last_name
          ).then((result) => {
            setProfileData(result.accessToken);
          });

          return false;
        // Для этих событий нужно открыть полноценный VK ID чтобы
        // пользователь дорегистрировался или подтвердил телефон
        case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED: //  = 'VKSDKOneTapAuthFullAuthNeeded'
        case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED: // = 'VKSDKOneTapAuthPhoneValidationNeeded'
        case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN: // = 'VKSDKButtonOneTapAuthShowLogin'
          return Connect.redirectAuth({
            url: "https://urfu-nvk.ru/auth",
            state: "",
          }); // url - строка с url, на который будет произведён редирект после авторизации.
        // state - состояние вашего приложение или любая произвольная строка, которая будет добавлена к url после авторизации.
        // Пользователь перешел по кнопке "Войти другим способом"
        case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS: // = 'VKSDKButtonOneTapAuthShowLoginOptions'
          // Параметр screen: phone позволяет сразу открыть окно ввода телефона в VK ID
          // Параметр url: ссылка для перехода после авторизации. Должен иметь https схему. Обязательный параметр.
          return Connect.redirectAuth({
            screen: "phone",
            url: "https://urfu-nvk.ru/auth",
          });
      }

      return false;
    },
    // Не обязательный параметр с настройками отображения OneTap
    options: {
      showAlternativeLogin: false, // Отображение кнопки "Войти другим способом"
      displayMode: "default", // Режим отображения кнопки 'default' | 'name_phone' | 'phone_name'
      buttonStyles: {
        borderRadius: 8, // Радиус скругления кнопок
      },
    },
  });

  if (oneTapButton) {
    // Получить iframe можно с помощью метода getFrame()
    placeToInsertFrame.appendChild(
      oneTapButton.getFrame() ?? document.createElement("div")
    );
  }
};

export const AuthPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const profileContext = useContext(ProfileDataContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isValidProfileData(profileContext)) {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const payloadFromVk = params.get('payload');

      // TODO: прибраться и обработать ошибки и json parse

      if (payloadFromVk) {
        setIsLoading(true);
        const obj = JSON.parse(payloadFromVk);
        if ('token' in obj && 'uuid' in obj && 'user' in obj && 'first_name' in obj.user && 'last_name' in obj.user) {
          exchangeVkSilentTokenApi(
            obj.token,
            obj.uuid,
            obj.user.first_name,
            obj.user.last_name
          ).then((result) => {
            profileContext.setData?.({ accessToken: result.accessToken });

            navigate("/cabinet/orders");
          })
            .finally(() => {
              setIsLoading(false);
            })
        }
      } else {
        setIsLoading(false);
        if (ref.current) {
          registerVkAuth(ref.current, (accesstoken: string) => {
            profileContext.setData?.({ accessToken: accesstoken });

            navigate("/cabinet/orders");
          });
        }
      }

      return () => {
        if (ref.current) {
          ref.current.innerHTML = "";
        }
      };
    }
  }, []);

  if (isValidProfileData(profileContext.data?.())) {
    return <Navigate to={"/cabinet/orders"} replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <svg width="124" height="44" viewBox="0 0 124 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M36.1634 0.363635V44H29.1321L8.57102 14.277H8.20881V44H0.303977V0.363635H7.37784L27.9176 30.108H28.3011V0.363635H36.1634ZM88.1946 44V0.363635H96.0994V20.4134H96.6321L113.656 0.363635H123.308L106.433 19.9446L123.457 44H113.955L100.936 25.2926L96.0994 31.0028V44H88.1946Z"
            className={styles.logoFill}/>
          <path
            d="M50.6147 0.363635L61.9712 34.7102H62.4187L73.7539 0.363635H82.4471L67.0636 44H57.305L41.9428 0.363635H50.6147Z"
            fill="#FBBA0E"/>
        </svg>
      </div>
      {isLoading && <LoaderComponent/>}
      <div className={styles.vkBtn} ref={ref}></div>
    </div>
  );
};
