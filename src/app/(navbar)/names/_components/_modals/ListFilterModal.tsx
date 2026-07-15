import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps, FilterParams } from "@/lib/types";
import { toArr, toOpts, toStr } from "@/lib/utils/fns";
import { Button, Form, Input, InputNumber, Radio, Select } from "antd";

export interface ListFilterModalProps extends BaseModalProps {
  onApply: (filters: FilterParams) => void;
  countries: string[];
  languages: string[];
  tags: string[];
  initialFilters: FilterParams;
  showHistory: boolean;
}

interface FormValues {
  name: string;
  country: string[];
  language: string[];
  tag: string[];
  position: number | undefined;
  status: string | undefined;
}

const ListFilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  languages,
  tags,
  initialFilters,
  showHistory,
}: ListFilterModalProps) => {
  const [form] = Form.useForm<FormValues>();

  const openValues: FormValues = {
    name: initialFilters.name,
    country: toArr(initialFilters.country),
    language: toArr(initialFilters.language),
    tag: toArr(initialFilters.tag),
    position: initialFilters.position ? Number(initialFilters.position) : undefined,
    status: showHistory ? initialFilters.status || "" : "current",
  };

  const clearedValues: FormValues = {
    name: "",
    country: [],
    language: [],
    tag: [],
    position: undefined,
    status: showHistory ? "" : "current",
  };

  const handleApply = (values: FormValues) => {
    onApply({
      name: values.name ?? "",
      country: toStr(values.country),
      language: toStr(values.language),
      tag: toStr(values.tag),
      position: values.position != null ? String(values.position) : "",
      status: values.status ?? "",
      letter: "",
    });
  };

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={480}
      title={<span className="text-xl font-bold text-muted">Filter Options</span>}
      footer={[
        <Button
          key="clear"
          onClick={() => form.setFieldsValue(clearedValues)}
          aria-label="Clear all filters"
        >
          Clear All
        </Button>,
        <Button key="apply" type="primary" onClick={() => form.submit()} aria-label="Apply filters">
          Apply
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleApply}
        className="py-4"
        initialValues={openValues}
      >
        <Form.Item label="Name" name="name">
          <Input placeholder="Enter typhoon name..." allowClear />
        </Form.Item>

        <Form.Item label="Contributed By" name="country">
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
          extra={<span id="filter-position-help">Enter a value between 1 and 140</span>}
          rules={[
            { type: "number", min: 1, max: 140, message: "Position must be between 1 and 140" },
          ]}
        >
          <InputNumber
            placeholder="Enter position (1–140)..."
            min={1}
            max={140}
            aria-describedby="filter-position-help"
          />
        </Form.Item>

        {showHistory && (
          <Form.Item label="Status" name="status" className="mb-0">
            <Radio.Group>
              <Radio value="">All</Radio>
              <Radio value="active">Active</Radio>
              <Radio value="retired">Retired</Radio>
            </Radio.Group>
          </Form.Item>
        )}
      </Form>
    </DefModal>
  );
};

export default ListFilterModal;
