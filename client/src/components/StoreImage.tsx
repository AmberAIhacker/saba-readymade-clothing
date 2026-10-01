import type { ComponentProps } from "react";

export function StoreImage({ onError, ...props }: ComponentProps<"img">) {
  return <img {...props} onError={(event) => {
    onError?.(event);
    if (event.currentTarget.dataset.fallbackApplied) return;
    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = "/product-placeholder.svg";
  }} />;
}
