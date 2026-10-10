"use client";

import { App, ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { ANTD_THEME } from "./theme";

const AntdProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider theme={ANTD_THEME}>
      <App component={false}>{children}</App>
    </ConfigProvider>
  );
};

export default AntdProvider;
