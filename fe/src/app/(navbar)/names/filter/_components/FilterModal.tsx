import { Modal, Button, Form, Input, Select, InputNumber } from "antd";
import type { BaseModalProps, FilterParams } from "../../../../../types";

export interface FilterModalProps extends BaseModalProps {
  onApply: (filters: FilterParams) => void;
  countries: string[];
  languages: string[];
  tags: string[];
  initialFilters: FilterParams;
}

const DELIMITER = "|";

const toArr = (val: string) => (val ? val.split(DELIMITER).filter(Boolean) : []);
const toStr = (val: string[] | undefined) => (val ?? []).join(DELIMITER);
const toOpts = (items: string[]) => items.map((v) => ({ label: v, value: v }));

interface FormValues {
  name: string;
  country: string[];
  language: string[];
  tag: string[];
  position: number | undefined;
}

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  languages,
  tags,
  initialFilters,
}: FilterModalProps) => {
  const [form] = Form.useForm<FormValues>();

  const handleApply = (values: FormValues) => {
    onApply({
      name: values.name ?? "",
      country: toStr(values.country),
      language: toStr(values.language),
      tag: toStr(values.tag),
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
            country: toArr(initialFilters.country),
            language: toArr(initialFilters.language),
            tag: toArr(initialFilters.tag),
            position: initialFilters.position ? Number(initialFilters.position) : undefined,
          });
        }
      }}
      styles={{ header: { borderBottom: "1px solid #9ca3af", paddingBottom: "12px" } }}
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

        <Form.Item label="Country" name="country">
          <Select
            mode="multiple"
            placeholder="All Countries"
            options={toOpts(countries)}
            allowClear
          />
        </Form.Item>

        <Form.Item label="Language" name="language">
          <Select
            mode="multiple"
            placeholder="All Languages"
            options={toOpts(languages)}
            allowClear
          />
        </Form.Item>

        <Form.Item label="Tag" name="tag">
          <Select mode="multiple" placeholder="All Tags" options={toOpts(tags)} allowClear />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          rules={[
            { type: "number", min: 1, max: 140, message: "Position must be between 1 and 140" },
          ]}
          className="mb-0"
        >
          <InputNumber placeholder="Enter position (1–140)..." min={1} max={140} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FilterModal;
