"use client";

import { Modal } from "antd";
import type { ReactNode } from "react";

interface DefModalProps {
  /** Whether the modal is open. Defaults to true (for always-mounted route modals). */
  open?: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number;
  /** Footer content. Defaults to null (no footer), which most dialogs use. */
  footer?: ReactNode;
  /** antd Modal lifecycle callback, e.g. to reset form state when the modal opens. */
  afterOpenChange?: (open: boolean) => void;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Shared modal shell applying the project's dialog chrome: centered, a
 * divider under the header, and a scrollable body. Call sites supply their
 * title, width, footer, and content.
 */
const DefModal = ({
  open = true,
  onClose,
  title,
  width = 480,
  footer = null,
  afterOpenChange,
  ariaLabel,
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
    aria-label={ariaLabel}
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
