"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ComponentProps } from "react";
import TyphoonSpinner from "../TyphoonSpinner";

type ImageWithLoaderProps = ComponentProps<typeof Image>;

const ImageWithLoader = ({ className, ...props }: ImageWithLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <TyphoonSpinner size="medium" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <ImageOff className="h-1/4 w-1/4 min-h-6 min-w-6 text-gray-300" strokeWidth={1.5} />
        </div>
      )}

      {!hasError && (
        <Image
          {...props}
          alt={props.alt || ""}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className ?? ""}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};

export default ImageWithLoader;
