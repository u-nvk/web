import { Navigate, createBrowserRouter } from "react-router-dom";
import { AuthPage } from "./pages/auth/auth.page";
import { CabinetLayout } from "./pages/cabinet/cabinet.layout";
import { OrdersPage } from "./pages/cabinet/pages/orders/orders.page";
import { OrdersCreatePage } from "./pages/cabinet/pages/orders/pages/create/orders-create.page";
import { OrderViewPage } from "./pages/cabinet/pages/orders/pages/view/order-view.page";
import { ProfilePage } from "./pages/cabinet/pages/profile/profile.page";
import { HistoryPage } from "./pages/cabinet/pages/history/history.page";
import {DriverPage} from "./pages/cabinet/pages/profile/pages/driver/driver.page";

export const routes = createBrowserRouter([
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
      {
        path: "profile/driver",
        element: <DriverPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "orders/create",
        element: <OrdersCreatePage />,
      },
      {
        path: "orders/:id",
        element: <OrderViewPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/auth"} replace />,
  },
]);
