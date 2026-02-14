export default function ExamRunner({ question, index, total, onAnswer, feedback, onNext, isLastQuestion }) {
  return (
    <section className="card">
      <div className="card-head">
        <i className="bi bi-pencil-square" />
        <h2>Examen en curso</h2>
      </div>

      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <p className="meta">Pregunta {index + 1} de {total}</p>

      <article className="question">{question.statement}</article>

      <div className="actions">
        <button type="button" className="btn btn-success" onClick={() => onAnswer(true)} disabled={Boolean(feedback)}>
          <i className="bi bi-check2-circle" />
          Verdadero
        </button>
        <button type="button" className="btn btn-danger" onClick={() => onAnswer(false)} disabled={Boolean(feedback)}>
          <i className="bi bi-x-circle" />
          Falso
        </button>
      </div>

      {feedback && (
        <>
          <div className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}>
            {feedback.isCorrect ? "Respuesta correcta." : "Respuesta incorrecta."} Correcta: <strong>{feedback.correctAnswer ? "Verdadero" : "Falso"}</strong>
          </div>
          <button type="button" className="btn btn-primary" onClick={onNext}>
            <i className={`bi ${isLastQuestion ? "bi-flag-fill" : "bi-arrow-right-circle"}`} />
            {isLastQuestion ? "Ver resultado" : "Siguiente pregunta"}
          </button>
        </>
      )}
    </section>
  );
}
