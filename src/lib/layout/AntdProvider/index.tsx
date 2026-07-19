"use client";

import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

/* Ant Design hardcodes its own font stack in the seed token rather than inheriting from the page, so the family has to be handed to it explicitly. */
const AntdProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider theme={{ token: { fontFamily: "var(--font-open-sans)" } }}>
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
