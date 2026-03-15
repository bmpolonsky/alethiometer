interface SaveReadingDialogProps {
  open: boolean;
  questionText: string;
  answerText: string;
  copy: {
    saveReadingTitle: string;
    saveReadingQuestionLabel: string;
    saveReadingQuestionPlaceholder: string;
    saveReadingAnswerLabel: string;
    saveReadingAnswerPlaceholder: string;
    confirmSaveReading: string;
    cancel: string;
  };
  onClose: () => void;
  onQuestionTextChange: (value: string) => void;
  onAnswerTextChange: (value: string) => void;
  onSave: () => void;
}

export function SaveReadingDialog({
  open,
  questionText,
  answerText,
  copy,
  onClose,
  onQuestionTextChange,
  onAnswerTextChange,
  onSave,
}: SaveReadingDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section
        className="modal-card save-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.saveReadingTitle}</p>
            <h2 className="drawer-title">{copy.saveReadingTitle}</h2>
          </div>
          <button className="ghost-action" onClick={onClose} type="button">
            {copy.cancel}
          </button>
        </div>

        <label className="form-field">
          <span className="meaning-label">{copy.saveReadingQuestionLabel}</span>
          <textarea
            className="modal-textarea"
            onChange={(event) => onQuestionTextChange(event.target.value)}
            placeholder={copy.saveReadingQuestionPlaceholder}
            rows={3}
            value={questionText}
          />
        </label>

        <label className="form-field">
          <span className="meaning-label">{copy.saveReadingAnswerLabel}</span>
          <textarea
            className="modal-textarea"
            onChange={(event) => onAnswerTextChange(event.target.value)}
            placeholder={copy.saveReadingAnswerPlaceholder}
            rows={4}
            value={answerText}
          />
        </label>

        <div className="modal-actions">
          <button className="ghost-action" onClick={onClose} type="button">
            {copy.cancel}
          </button>
          <button className="primary-action" onClick={onSave} type="button">
            {copy.confirmSaveReading}
          </button>
        </div>
      </section>
    </div>
  );
}
