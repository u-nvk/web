import "./App.css";
import {RouterProvider} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProfileData, ProfileDataContext,} from "./context/profile-data.context";
import {useStorage} from "./hooks/utils/storage.hook";
import {StorageKey} from "./enums";
import {routes} from "./routes";
import vkBridge from "@vkontakte/vk-bridge";
import {Toaster} from "react-hot-toast";

function App() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const storage = useStorage();
  const [isInsideVk, setInsideVk] = useState(false);

  useEffect(() => {
    vkBridge.send('VKWebAppInit')
      .then((data) => {
        setInsideVk(true);
        if (data.result) {
          // Приложение инициализировано
        } else {
          // Ошибка
        }
      })
      .catch((error) => {
        // Ошибка
        console.log(error);
      });
  }, []);

  if (isInsideVk) {
    return (
      <div className="wra">
        <Toaster toastOptions={{
          className: 'regularText',
          style: {
            fontSize: '12px'
          }
        }} />
        <div className="forVk"></div>
        <div className="other">
          <ProfileDataContext.Provider
            value={{
              data: () => {
                if (profileData) {
                  return profileData;
                }

                if (storage.read(StorageKey.profile)) {
                  return JSON.parse(storage.read(StorageKey.profile) ?? "{}");
                }

                return null;
              },
              setData: (data: ProfileData) => {
                setProfileData(data);
                storage.write(StorageKey.profile, JSON.stringify(data));
              },
              clear: () => {
                setProfileData(null)
              }
            }}
          >
            <RouterProvider router={routes}/>
          </ProfileDataContext.Provider>
        </div>
      </div>
    )
  }

  return (
    <div className="wra">
      <Toaster toastOptions={{
        className: 'regularText',
        style: {
          fontSize: '12px'
        }
      }} />
      <ProfileDataContext.Provider
        value={{
          data: () => {
            if (profileData) {
              return profileData;
            }

            if (storage.read(StorageKey.profile)) {
              return JSON.parse(storage.read(StorageKey.profile) ?? "{}");
            }

            return null;
          },
          setData: (data: ProfileData) => {
            setProfileData(data);
            storage.write(StorageKey.profile, JSON.stringify(data));
          },
          clear: () => {
            setProfileData(null)
          }
        }}
      >
        <RouterProvider router={routes}/>
      </ProfileDataContext.Provider>
    </div>
  );
}

export default App;
