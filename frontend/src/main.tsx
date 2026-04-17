import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/globals.css";

/**
 * React 專案的進入點。
 *
 * 可以把它理解成：
 * 瀏覽器一打開前端專案時，最先被執行的就是這個檔案。
 *
 * ReactDOM.createRoot(...)：
 * - 把 React App 掛到 index.html 裡面的 <div id="root"></div>
 *
 * <React.StrictMode>：
 * - 開發模式下檢查一些潛在問題
 * - 有時候某些邏輯會在開發模式執行兩次，這是正常的
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
