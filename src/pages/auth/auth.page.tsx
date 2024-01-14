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
      console.log(e);

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
      {isLoading && <div>Loading</div>}
      <div className={styles.vkBtn} ref={ref}></div>
    </div>
  );
};
