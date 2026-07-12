"use client";

import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

/**
 * Points Ant Design's font token at the app font stack (--font-sans,
 * defined in globals.css) so AntD components match the rest of the UI.
 */
export default function AntdConfig({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ token: { fontFamily: "var(--font-sans)" } }}>
      {children}
    </ConfigProvider>
  );
}
