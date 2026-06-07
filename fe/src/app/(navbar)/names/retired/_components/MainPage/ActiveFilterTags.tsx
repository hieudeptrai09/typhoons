import { Tag } from "antd";
import type { RetiredFilterParams } from "../../../../../../types";

interface ActiveFilterTagsProps {
  params: RetiredFilterParams;
  onRemove: (key: keyof RetiredFilterParams, value?: string) => void;
}

const REASON_LABELS: Record<string, string> = {
  "0": "Destructive",
  "1": "Language Problem",
  "2": "Misspelling",
  "3": "Special Storm",
};

const fmtMulti = (val: string) => val.split(",").filter(Boolean);

const ActiveFilterTags = ({ params, onRemove }: ActiveFilterTagsProps) => {
  const tags: { key: keyof RetiredFilterParams; label: string; value?: string }[] = [];

  if (params.name) {
    tags.push({ key: "name", label: `Name: ${params.name}` });
  }

  if (params.year) {
    tags.push({ key: "year", label: `Year: ${params.year}` });
  }

  fmtMulti(params.country).forEach((v) =>
    tags.push({ key: "country", label: `Country: ${v}`, value: v }),
  );

  if (params.position) {
    tags.push({ key: "position", label: `Position: #${params.position}` });
  }

  fmtMulti(params.reason).forEach((v) =>
    tags.push({ key: "reason", label: `Reason: ${REASON_LABELS[v] ?? v}`, value: v }),
  );

  if (tags.length === 0) return null;

  return (
    <div className="mx-auto mb-6 flex max-w-4xl flex-wrap justify-center gap-2">
      {tags.map((tag, idx) => (
        <Tag
          key={idx}
          closable
          color="orange"
          onClose={() => onRemove(tag.key, tag.value)}
          className="!px-3 !py-0.5 !text-sm"
        >
          {tag.label}
        </Tag>
      ))}
    </div>
  );
};

export default ActiveFilterTags;
