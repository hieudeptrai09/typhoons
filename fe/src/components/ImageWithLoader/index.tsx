"use client";

import Image from "next/image";
import { useState } from "react";
import type { ComponentProps } from "react";
import Loader from "../Loader";

type ImageWithLoaderProps = ComponentProps<typeof Image>;

const ImageWithLoader = ({ className, ...props }: ImageWithLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <Loader size="sm" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-xs text-gray-400">
          No image
        </div>
      )}

      {!hasError && (
        <Image
          {...props}
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
