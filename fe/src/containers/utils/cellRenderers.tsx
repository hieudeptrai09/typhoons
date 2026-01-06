import type { ReactNode, CSSProperties } from "react";
import { Check, X } from "lucide-react";
import Image from "next/image";
import IntensityBadge from "../../components/IntensityBadge";
import { getPositionTitle } from "./fns";
import type { IntensityType } from "../../types";

export const getCellRenderer = <T extends object>(
  key: keyof T,
  row: T,
  className: string = "",
  style?: CSSProperties,
): ReactNode => {
  const value = row[key];

  switch (key) {
    case "name": {
      return (
        <span className={`font-bold ${className}`} style={style}>
          {String(value)}
        </span>
      );
    }

    case "image": {
      if (!value) {
        return <span className="text-gray-400">-</span>;
      }

      const imageSrc = String(value);
      const altText = "name" in row && typeof row.name === "string" ? row.name : "Image";

      return (
        <div className={`relative max-h-52 min-h-24 min-w-28 ${className}`}>
          <Image src={imageSrc} alt={altText} fill className="rounded object-cover" unoptimized />
        </div>
      );
    }

    case "isRetired": {
      if (Boolean(value)) {
        return <Check className={className} style={style} size={20} />;
      }
      return <X className="text-gray-600" size={20} />;
    }

    case "position": {
      return (
        <span className={className} style={style}>
          {getPositionTitle(Number(value))}
        </span>
      );
    }

    case "intensity": {
      return <IntensityBadge intensity={value as IntensityType} />;
    }

    case "average": {
      return (
        <span className={`font-semibold ${className}`} style={style}>
          {String(value)}
        </span>
      );
    }

    // Default rendering for all other keys
    default: {
      if (!value) {
        return <span className="text-gray-700">-</span>;
      }
      return (
        <span className={className} style={style}>
          {String(value)}
        </span>
      );
    }
  }
};

export const createRenderCell = <T extends object>(
  getCellConfig?: (row: T, key: keyof T) => { className?: string; style?: CSSProperties },
) => {
  return (row: T, column: { key: keyof T }): ReactNode => {
    const config = getCellConfig?.(row, column.key) || {};
    const className = config.className || "";
    const style = config.style;

    return getCellRenderer(column.key, row, className, style);
  };
};
