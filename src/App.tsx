import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useState } from "react";
import {
  ProfileData,
  ProfileDataContext,
} from "./context/profile-data.context";
import { useStorage } from "./hooks/utils/storage.hook";
import { StorageKey } from "./enums";
import { routes } from "./routes";

function App() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const storage = useStorage();

  return (
    <div className="wra">
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
        }}
      >
        <RouterProvider router={routes} />
      </ProfileDataContext.Provider>
    </div>
  );
}

export default App;
