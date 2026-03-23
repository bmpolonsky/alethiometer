interface HelpPanelProps {
  help: {
    guidanceTitle: string;
    helpIntro: string;
    helpSections: Array<{
      title: string;
      intro?: string;
      items: string[];
    }>;
  };
}

export function HelpPanel({ help }: HelpPanelProps) {
  return (
    <section className="help-panel">
      <div className="panel-heading compact">
        <p className="panel-kicker">{help.guidanceTitle}</p>
        <p className="panel-copy">{help.helpIntro}</p>
      </div>

      <div className="help-sections">
        {help.helpSections.map((section) => (
          <section className="help-section" key={section.title}>
            <h3 className="help-section-title">{section.title}</h3>
            {section.intro ? <p className="panel-copy help-section-intro">{section.intro}</p> : null}
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
