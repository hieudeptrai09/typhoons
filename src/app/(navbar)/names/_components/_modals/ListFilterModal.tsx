import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps, FilterParams } from "@/lib/types";
import { getPositionTitle, parsePositionLabel, toArr, toOpts, toStr } from "@/lib/utils/fns";
import { Button, Form, Input, Radio, Select } from "antd";

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
  position: string;
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
    position: initialFilters.position ? getPositionTitle(Number(initialFilters.position)) : "",
    status: showHistory ? initialFilters.status || "" : "current",
  };

  const clearedValues: FormValues = {
    name: "",
    country: [],
    language: [],
    tag: [],
    position: "",
    status: showHistory ? "" : "current",
  };

  const handleApply = (values: FormValues) => {
    const position = values.position ? parsePositionLabel(values.position) : null;
    onApply({
      name: values.name ?? "",
      country: toStr(values.country),
      language: toStr(values.language),
      tag: toStr(values.tag),
      position: position != null ? String(position) : "",
      status: values.status ?? "",
      letter: "",
    });
  };

  return (
    <DefModal
      open={isOpen}
      onClose={onClose}
      width={480}
      title={<span className="text-xl font-bold text-foreground">Filter Options</span>}
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
          extra={
            <span id="filter-position-help">Grid position (row + country letter), e.g. 3I</span>
          }
          rules={[
            {
              validator: (_, value: string) =>
                !value || parsePositionLabel(value) !== null
                  ? Promise.resolve()
                  : Promise.reject(new Error("Enter a grid position like 3I, or a number 1–140")),
            },
          ]}
        >
          <Input placeholder="e.g. 3I or 37" allowClear aria-describedby="filter-position-help" />
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
