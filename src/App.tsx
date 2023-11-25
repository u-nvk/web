import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthPage } from "./pages/auth/auth.page";
import { CabinetLayout } from "./pages/cabinet/cabinet.layout";
import { ProfilePage } from "./pages/cabinet/pages/profile/profile.page";
import { useState } from "react";
import {
  ProfileData,
  ProfileDataContext,
} from "./context/profile-data.context";
import { useStorage } from "./hooks/utils/storage.hook";

const routes = createBrowserRouter([
  {
    path: "auth",
    element: <AuthPage />,
  },
  {
    path: "cabinet",
    element: <CabinetLayout />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

function App() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const storage = useStorage();

  return (
    <>
      <ProfileDataContext.Provider
        value={{
          data: () => {
            if (profileData) {
              return profileData;
            }

            if (storage.read("profile")) {
              return JSON.parse(storage.read("profile") ?? "{}");
            }

            return null;
          },
          setData: (data: ProfileData) => {
            setProfileData(data);
            storage.write("profile", JSON.stringify(data));
          },
        }}
      >
        <RouterProvider router={routes} />
      </ProfileDataContext.Provider>
    </>
  );
}

export default App;
