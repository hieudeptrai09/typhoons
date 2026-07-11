"use client";

import { Modal } from "antd";
import type { ReactNode } from "react";

interface DefModalProps {
  open?: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number;
  footer?: ReactNode;
  afterOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const DefModal = ({
  open = true,
  onClose,
  title,
  width = 480,
  footer = null,
  afterOpenChange,
  children,
}: DefModalProps) => (
  <Modal
    open={open}
    onCancel={onClose}
    width={width}
    footer={footer}
    centered
    destroyOnHidden
    afterOpenChange={afterOpenChange}
    styles={{
      header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
      body: { maxHeight: "70vh", overflowY: "auto" },
    }}
    title={title}
  >
    {children}
  </Modal>
);

export default DefModal;
