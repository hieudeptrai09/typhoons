import { Tag } from "antd";
import type { FilterParams } from "../../../../../types";

interface ActiveFilterTagsProps {
  params: FilterParams;
  onRemove: (key: keyof FilterParams, value?: string) => void;
}

const fmtMulti = (val: string) => val.split(",").filter(Boolean);

const ActiveFilterTags = ({ params, onRemove }: ActiveFilterTagsProps) => {
  const tags: { key: keyof FilterParams; label: string; value?: string }[] = [];

  if (params.name) {
    tags.push({ key: "name", label: `Name: ${params.name}` });
  }

  fmtMulti(params.country).forEach((v) =>
    tags.push({ key: "country", label: `Country: ${v}`, value: v }),
  );

  fmtMulti(params.language).forEach((v) =>
    tags.push({ key: "language", label: `Language: ${v}`, value: v }),
  );

  fmtMulti(params.tag).forEach((v) => tags.push({ key: "tag", label: `Tag: ${v}`, value: v }));

  if (params.position) {
    tags.push({ key: "position", label: `Position: #${params.position}` });
  }

  if (tags.length === 0) return null;

  return (
    <div className="mx-auto mb-6 flex max-w-4xl flex-wrap justify-center gap-2">
      {tags.map((tag, idx) => (
        <Tag
          key={idx}
          closable
          color="green"
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
