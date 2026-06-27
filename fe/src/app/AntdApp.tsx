"use client";

import { App } from "antd";

const AntdApp = ({ children }: { children: React.ReactNode }) => {
  return <App>{children}</App>;
};

export default AntdApp;
