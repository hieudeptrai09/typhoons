"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";
import { useState, type ReactNode } from "react";

// Replaces @ant-design/nextjs-registry's AntdRegistry, which always inlines the extracted
// stylesheet into the document. That block is ~150 KB and near-identical on every page, so
// in production the layout links the prebuilt src/app/antd.css instead and nothing is
// inlined — see scripts/extract-antd-css.ts.
//
// Dev keeps inlining so styling survives edits without regenerating the file. Setting
// ANTD_INLINE_CSS=1 forces it on in a production build, which is how
// scripts/check-antd-css.ts gets something to compare the generated file against.
const INLINE = process.env.NODE_ENV !== "production" || process.env.ANTD_INLINE_CSS === "1";

const AntdRegistry = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(() => createCache());

  useServerInsertedHTML(() => {
    if (!INLINE) return null;

    const styleText = extractStyle(cache, { plain: true, once: true });
    // cssinjs emits only its cache marker when every style is already accounted for.
    if (styleText.includes('.data-ant-cssinjs-cache-path{content:"";}')) return null;

    return (
      <style
        id="antd-cssinjs"
        // Must land before the styles Ant Design generates on the client.
        data-rc-order="prepend"
        data-rc-priority="-1000"
        dangerouslySetInnerHTML={{ __html: styleText }}
      />
    );
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default AntdRegistry;
