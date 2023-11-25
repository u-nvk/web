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

  return (
    <>
      <ProfileDataContext.Provider
        value={{
          data: profileData,
          setData: setProfileData,
        }}
      >
        <RouterProvider router={routes} />
      </ProfileDataContext.Provider>
    </>
  );
}

export default App;
