import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import vkBridge from "@vkontakte/vk-bridge";

vkBridge.send("VKWebAppInit");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);
