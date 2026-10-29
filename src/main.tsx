import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./fonts.css";
import "./index.css";

const rootElement = document.querySelector<HTMLDivElement>("#root");

if (!rootElement) throw new Error("未找到 #root 挂载节点");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
