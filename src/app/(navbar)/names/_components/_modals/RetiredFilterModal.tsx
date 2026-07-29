import DefModal from "@/lib/components/DefModal";
import type { BaseModalProps, RetiredFilterParams, RetirementReason } from "@/lib/types";
import { getPositionTitle, parsePositionLabel, toArr, toOpts, toStr } from "@/lib/utils/fns";
import { Button, DatePicker, Form, Input, Select } from "antd";
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
  position: string;
}

const REASON_OPTIONS: { value: RetirementReason; label: string }[] = [
  { value: "destructive", label: "Destructive Storm" },
  { value: "language", label: "Language Problem" },
  { value: "misspell", label: "Misspelling" },
  { value: "special", label: "Special Storm" },
];

const RetiredFilterModal = ({
  isOpen,
  onClose,
  onApply,
  countries,
  initialFilters,
}: RetiredFilterModalProps) => {
  const [form] = Form.useForm<FormValues>();

  const openValues: FormValues = {
    name: initialFilters.name,
    year: initialFilters.year ? dayjs().year(Number(initialFilters.year)) : undefined,
    country: toArr(initialFilters.country),
    reason: toArr(initialFilters.reason),
    position: initialFilters.position ? getPositionTitle(Number(initialFilters.position)) : "",
  };

  const clearedValues: FormValues = {
    name: "",
    year: undefined,
    country: [],
    reason: [],
    position: "",
  };

  const handleApply = (values: FormValues) => {
    const position = values.position ? parsePositionLabel(values.position) : null;
    onApply({
      name: values.name ?? "",
      year: values.year ? String(values.year.year()) : "",
      country: toStr(values.country),
      reason: toStr(values.reason),
      position: position != null ? String(position) : "",
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
          extra={
            <span id="retired-position-help">Grid position (row + country letter), e.g. 3I</span>
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
          <Input placeholder="e.g. 3I or 37" allowClear aria-describedby="retired-position-help" />
        </Form.Item>

        <Form.Item label="Retirement Reason" name="reason" className="mb-0">
          <Select mode="multiple" placeholder="All Reasons" options={REASON_OPTIONS} allowClear />
        </Form.Item>
      </Form>
    </DefModal>
  );
};

export default RetiredFilterModal;
