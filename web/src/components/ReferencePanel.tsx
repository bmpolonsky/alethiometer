interface ReferencePanelProps {
  copy: {
    guidanceTitle: string;
    guidancePreview: string;
    helpSection: string;
  };
  onOpenHelp: () => void;
}

export function ReferencePanel({ copy, onOpenHelp }: ReferencePanelProps) {
  return (
    <section className="panel reference-panel">
      <div className="reference-block">
        <div className="reference-header">
          <div className="panel-heading compact">
            <p className="panel-kicker">{copy.guidanceTitle}</p>
            <p className="panel-copy">{copy.guidancePreview}</p>
          </div>
          <button
            className="ghost-action small-action inline-action"
            onClick={onOpenHelp}
            type="button"
          >
            {copy.helpSection}
          </button>
        </div>
      </div>
    </section>
  );
}
