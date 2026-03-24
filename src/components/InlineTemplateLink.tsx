interface InlineTemplateLinkProps {
  template: string;
  token: string;
  label: string;
  onClick: () => void;
  className?: string;
}

export function InlineTemplateLink({
  template,
  token,
  label,
  onClick,
  className,
}: InlineTemplateLinkProps) {
  const parts = template.split(token);

  if (parts.length === 1) {
    return <span className={className}>{template}</span>;
  }

  return (
    <span className={className}>
      {parts[0]}
      <button className="text-link-button" onClick={onClick} type="button">
        {label}
      </button>
      {parts.slice(1).join(token)}
    </span>
  );
}
