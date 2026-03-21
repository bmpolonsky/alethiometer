interface ReferencePanelProps {
  help: {
    guidanceTitle: string;
    guidancePreview: string;
    guidanceSteps: string;
  };
  copy: {
    helpSection: string;
  };
  onOpenHelp: () => void;
}

export function ReferencePanel({ help, copy, onOpenHelp }: ReferencePanelProps) {
  return (
    <section className="panel reference-panel">
      <div className="reference-block">
        <div className="reference-header">
          <div className="panel-heading compact">
            <p className="panel-kicker">{help.guidanceTitle}</p>
            <p className="panel-copy">{help.guidancePreview}</p>
            <p className="panel-copy reference-flow">{help.guidanceSteps}</p>
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
