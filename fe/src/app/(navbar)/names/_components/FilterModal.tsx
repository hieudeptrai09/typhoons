import { Modal, Button, Form, Input, Select, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";
import { toArr, toStr, toOpts } from "../../../../containers/utils/fns";
import { REASON_OPTIONS } from "../_utils/fns";
import type { BaseModalProps, NamesFilterParams } from "../../../../types";
import type { Dayjs } from "dayjs";

export interface FilterModalProps extends BaseModalProps {
  onApply: (filters: NamesFilterParams) => void;
  countries: string[];
  languages: string[];
  tags: string[];
  showRetiredFields: boolean;
  initialFilters: NamesFilterParams;
}

interface FormValues {
  name: string;
  country: string[];
  language: string[];
  tag: string[];
  position: number | undefined;
  year: Dayjs | undefined;
  reason: string[];
}

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  languages,
  tags,
  showRetiredFields,
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
      year: values.year ? String(values.year.year()) : "",
      reason: toStr(values.reason),
      status: initialFilters.status,
      view: initialFilters.view,
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
            year: initialFilters.year ? dayjs().year(Number(initialFilters.year)) : undefined,
            reason: toArr(initialFilters.reason),
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleApply}
        className="max-h-[90%] overflow-y-auto py-4"
      >
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
        >
          <InputNumber placeholder="Enter position (1–140)..." min={1} max={140} className="w-full" />
        </Form.Item>

        {showRetiredFields && (
          <>
            <Form.Item label="Year of Last Storm" name="year">
              <DatePicker
                picker="year"
                placeholder="Select year..."
                className="w-full"
                minDate={dayjs().year(2000)}
                maxDate={dayjs()}
              />
            </Form.Item>

            <Form.Item label="Retirement Reason" name="reason" className="mb-0">
              <Select mode="multiple" placeholder="All Reasons" options={REASON_OPTIONS} allowClear />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FilterModal;
