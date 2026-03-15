interface HelpPanelProps {
  copy: {
    guidanceTitle: string;
    helpIntro: string;
    helpSections: Array<{
      title: string;
      items: string[];
    }>;
  };
}

export function HelpPanel({ copy }: HelpPanelProps) {
  return (
    <section className="help-panel">
      <div className="panel-heading compact">
        <p className="panel-kicker">{copy.guidanceTitle}</p>
        <p className="panel-copy">{copy.helpIntro}</p>
      </div>

      <div className="help-sections">
        {copy.helpSections.map((section) => (
          <section className="help-section" key={section.title}>
            <h3 className="help-section-title">{section.title}</h3>
            <ul className="meaning-list guidance-bullets">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
