import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Config, Connect, ConnectEvents} from "@vkontakte/superappkit";
import {VKSilentAuthPayload} from "@vkontakte/superappkit/dist/connect/types";

Config.init({
  appId: 51785691, // идентификатор приложения
});


const oneTapButton = Connect.buttonOneTapAuth({
  // Обязательный параметр в который нужно добавить обработчик событий приходящих из SDK
  callback: function(e) {
    const type = e.type;

    debugger;


    if (!type) {
      return false;
    }

    switch (type) {
      case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS: // = 'VKSDKOneTapAuthLoginSuccess'

        console.log(e);

        fetch('http://localhost:3000/identity/api/v1/exchange-vk-token', {
          method: 'POST',
          body: JSON.stringify({
            vkToken: (e.payload as VKSilentAuthPayload).token,
            vkUuid: (e.payload as VKSilentAuthPayload).uuid,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((a) => a.json())
          .then((r) => console.log(r))

        return false
      // Для этих событий нужно открыть полноценный VK ID чтобы
      // пользователь дорегистрировался или подтвердил телефон
      case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED: //  = 'VKSDKOneTapAuthFullAuthNeeded'
      case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED: // = 'VKSDKOneTapAuthPhoneValidationNeeded'
      case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN: // = 'VKSDKButtonOneTapAuthShowLogin'
        return Connect.redirectAuth({ url: 'https://localhost/integration', state: ''}); // url - строка с url, на который будет произведён редирект после авторизации.
      // state - состояние вашего приложение или любая произвольная строка, которая будет добавлена к url после авторизации.
      // Пользователь перешел по кнопке "Войти другим способом"
      case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS: // = 'VKSDKButtonOneTapAuthShowLoginOptions'
        // Параметр screen: phone позволяет сразу открыть окно ввода телефона в VK ID
        // Параметр url: ссылка для перехода после авторизации. Должен иметь https схему. Обязательный параметр.
        return Connect.redirectAuth({ screen: 'phone', url: 'https://urfu-nvk.ru/integration' });
    }


    return false;
  },
  // Не обязательный параметр с настройками отображения OneTap
  options: {
    showAlternativeLogin: true, // Отображение кнопки "Войти другим способом"
    displayMode: 'default', // Режим отображения кнопки 'default' | 'name_phone' | 'phone_name'
    buttonStyles: {
      borderRadius: 8, // Радиус скругления кнопок
    }
  },
});


if (oneTapButton) {
// Получить iframe можно с помощью метода getFrame()
  document.body.appendChild(oneTapButton.getFrame() ?? document.createElement('div'));
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    </>
  )
}

export default App
