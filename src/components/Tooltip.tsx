interface TooltipProps {
  x: number;
  y: number;
  visible: boolean;
  border: "positivo" | "cercano" | "negativo" | "default";
  content: string;
  label?: string;
}

export default function Tooltip({
  x,
  y,
  visible,
  border,
  content,
  label,
}: TooltipProps) {
  if (!visible || !content) return null;

  const style = {
    left: x + 12,
    top: y + 12,
    position: "absolute" as const,
  };

  return (
    <div className={`tooltip border-${border}`} style={style}>
      {label && <div className="tooltip-label">{label}</div>}
      <div className="tooltip-content">{content}</div>
    </div>
  );
}