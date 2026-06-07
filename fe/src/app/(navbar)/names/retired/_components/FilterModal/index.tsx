import { Modal, Button, Form, Input, Select, InputNumber } from "antd";
import type { BaseModalProps, RetiredFilterParams } from "../../../../../../types";

interface FilterModalProps extends BaseModalProps {
  onApply: (filters: RetiredFilterParams) => void;
  countries: string[];
  initialFilters: RetiredFilterParams;
}

interface FormValues {
  name: string;
  year: number | undefined;
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

const toArr = (val: string) => (val ? val.split(",").filter(Boolean) : []);
const toStr = (val: string[] | undefined) => (val ?? []).join(",");
const toOpts = (items: string[]) => items.map((v) => ({ label: v, value: v }));

const FilterModal = ({ isOpen, onClose, onApply, countries, initialFilters }: FilterModalProps) => {
  const [form] = Form.useForm<FormValues>();

  const handleApply = (values: FormValues) => {
    onApply({
      name: values.name ?? "",
      year: values.year != null ? String(values.year) : "",
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
      width={672}
      centered
      destroyOnHidden
      afterOpenChange={(open) => {
        if (open) {
          form.setFieldsValue({
            name: initialFilters.name,
            year: initialFilters.year ? Number(initialFilters.year) : undefined,
            country: toArr(initialFilters.country),
            reason: toArr(initialFilters.reason),
            position: initialFilters.position ? Number(initialFilters.position) : undefined,
          });
        }
      }}
      title={<span className="text-xl font-bold text-gray-700">Filter Options</span>}
      footer={[
        <Button key="clear" onClick={() => form.resetFields()}>
          Clear All
        </Button>,
        <Button key="apply" type="primary" onClick={() => form.submit()}>
          Apply
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleApply} className="py-4">
        <Form.Item label="Name" name="name">
          <Input placeholder="Enter typhoon name..." allowClear />
        </Form.Item>

        <Form.Item
          label="Year"
          name="year"
          rules={[
            { type: "number", min: 2000, max: 2100, message: "Year must be between 2000 and 2100" },
          ]}
        >
          <InputNumber placeholder="Enter year..." min={2000} max={2100} className="w-full" />
        </Form.Item>

        <Form.Item label="Country" name="country">
          <Select
            mode="multiple"
            placeholder="All Countries"
            options={toOpts(countries)}
            allowClear
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          rules={[
            { type: "number", min: 1, max: 140, message: "Position must be between 1 and 140" },
          ]}
        >
          <InputNumber
            placeholder="Enter position (1–140)..."
            min={1}
            max={140}
            className="w-full"
          />
        </Form.Item>

        <Form.Item label="Retirement Reason" name="reason" className="mb-0">
          <Select
            mode="multiple"
            placeholder="All Reasons"
            options={REASON_OPTIONS}
            allowClear
            className="w-full"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FilterModal;
