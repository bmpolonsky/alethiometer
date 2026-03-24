import { appController } from "../app/services/appController";
import { uiStoreActions } from "../app/store/uiStore";

interface SaveReadingDialogProps {
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
}

export function SaveReadingDialog({
  questionText,
  answerText,
  copy,
}: SaveReadingDialogProps) {
  return (
    <div className="modal-backdrop" onClick={uiStoreActions.closeSaveDialog} role="presentation">
      <section
        className="modal-card save-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.saveReadingTitle}</p>
            <h2 className="drawer-title">{copy.saveReadingTitle}</h2>
          </div>
          <button className="ghost-action" onClick={uiStoreActions.closeSaveDialog} type="button">
            {copy.cancel}
          </button>
        </div>

        <label className="form-field">
          <span className="meaning-label">{copy.saveReadingQuestionLabel}</span>
          <textarea
            className="modal-textarea"
            onChange={(event) => uiStoreActions.setSaveQuestionText(event.target.value)}
            placeholder={copy.saveReadingQuestionPlaceholder}
            rows={3}
            value={questionText}
          />
        </label>

        <label className="form-field">
          <span className="meaning-label">{copy.saveReadingAnswerLabel}</span>
          <textarea
            className="modal-textarea"
            onChange={(event) => uiStoreActions.setSaveAnswerText(event.target.value)}
            placeholder={copy.saveReadingAnswerPlaceholder}
            rows={4}
            value={answerText}
          />
        </label>

        <div className="modal-actions">
          <button className="ghost-action" onClick={uiStoreActions.closeSaveDialog} type="button">
            {copy.cancel}
          </button>
          <button className="primary-action" onClick={appController.confirmSaveReading} type="button">
            {copy.confirmSaveReading}
          </button>
        </div>
      </section>
    </div>
  );
}
