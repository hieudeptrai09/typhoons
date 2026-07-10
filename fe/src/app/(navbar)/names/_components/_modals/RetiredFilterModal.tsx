import type { BaseModalProps, RetiredFilterParams } from "@/lib/types";
import { toArr, toOpts, toStr } from "@/lib/utils/fns";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

interface RetiredFilterModalProps extends BaseModalProps {
  onApply: (filters: RetiredFilterParams) => void;
  countries: string[];
  initialFilters: RetiredFilterParams;
}

interface FormValues {
  name: string;
  year: Dayjs | undefined;
  country: string[];
  reason: string[];
  position: number | undefined;
}

const REASON_OPTIONS = [
  { value: "0", label: "Destructive Storm" },
  { value: "1", label: "Language Problem" },
  { value: "2", label: "Misspelling" },
  { value: "3", label: "Special Storm" },
];

const RetiredFilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  initialFilters,
}: RetiredFilterModalProps) => {
  const [form] = Form.useForm<FormValues>();

  const handleApply = (values: FormValues) => {
    onApply({
      name: values.name ?? "",
      year: values.year ? String(values.year.year()) : "",
      country: toStr(values.country),
      reason: toStr(values.reason),
      position: values.position != null ? String(values.position) : "",
      letter: "",
    });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={480}
      centered
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open) {
          form.setFieldsValue({
            name: initialFilters.name,
            year: initialFilters.year ? dayjs().year(Number(initialFilters.year)) : undefined,
            country: toArr(initialFilters.country),
            reason: toArr(initialFilters.reason),
            position: initialFilters.position ? Number(initialFilters.position) : undefined,
          });
        }
      }}
      styles={{
        // CONSOLIDATION: duplicated modal-header style, see InfoModal.tsx note.
        header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" },
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
      title={<span className="text-xl font-bold text-muted">Filter Options</span>}
      footer={[
        <Button key="clear" onClick={() => form.resetFields()} aria-label="Clear all filters">
          Clear All
        </Button>,
        <Button key="apply" type="primary" onClick={() => form.submit()} aria-label="Apply filters">
          Apply
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleApply} className="py-4">
        <Form.Item label="Name" name="name">
          <Input placeholder="Enter typhoon name..." allowClear />
        </Form.Item>

        <Form.Item label="Year" name="year">
          <DatePicker
            picker="year"
            placeholder="Select year..."
            className="w-full"
            minDate={dayjs().year(2000)}
            maxDate={dayjs()}
          />
        </Form.Item>

        <Form.Item label="Contributed By" name="country">
          <Select
            mode="multiple"
            placeholder="All Countries"
            options={toOpts(countries)}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          extra={<span id="retired-position-help">Enter a value between 1 and 140</span>}
          rules={[
            { type: "number", min: 1, max: 140, message: "Position must be between 1 and 140" },
          ]}
        >
          <InputNumber
            placeholder="Enter position (1–140)..."
            min={1}
            max={140}
            aria-describedby="retired-position-help"
          />
        </Form.Item>

        <Form.Item label="Retirement Reason" name="reason" className="mb-0">
          <Select mode="multiple" placeholder="All Reasons" options={REASON_OPTIONS} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RetiredFilterModal;
