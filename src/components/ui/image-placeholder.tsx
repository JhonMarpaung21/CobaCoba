import { Image as ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div
      className={className ? `image-placeholder ${className}` : "image-placeholder"}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <ImageIcon size={32} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
