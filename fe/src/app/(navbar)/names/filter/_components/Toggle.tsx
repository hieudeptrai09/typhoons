import type { ToggleProps } from "../../../../../types";

const Toggle = ({ value, onChange }: ToggleProps) => {
  return (
    <div className="mx-auto mb-6 flex max-w-4xl items-center justify-end gap-3">
      <label className="text-sm font-semibold text-gray-700">Show Images & Descriptions</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-blue-600" : "bg-gray-400"
        }`}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
