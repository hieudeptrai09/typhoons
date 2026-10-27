"use client";

import { ANTD_THEME } from "@/lib/styles/antdTheme";
import { App, ConfigProvider } from "antd";
import type { ReactNode } from "react";

const AntdProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider theme={ANTD_THEME}>
      <App component={false}>{children}</App>
    </ConfigProvider>
  );
};

export default AntdProvider;
