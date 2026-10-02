import type { ComponentProps } from "react";
import { getDisplayImageUrl } from "../imageUrl";

export function StoreImage({ onError, ...props }: ComponentProps<"img">) {
  return <img {...props} src={getDisplayImageUrl(props.src)} onError={(event) => {
    onError?.(event);
    if (event.currentTarget.dataset.fallbackApplied) return;
    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = "/product-placeholder.svg";
  }} />;
}
