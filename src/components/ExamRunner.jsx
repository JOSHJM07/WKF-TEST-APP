export default function ExamRunner({ question, index, total, onAnswer }) {
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
        <button type="button" className="btn btn-success" onClick={() => onAnswer(true)}>
          <i className="bi bi-check2-circle" />
          Verdadero
        </button>
        <button type="button" className="btn btn-danger" onClick={() => onAnswer(false)}>
          <i className="bi bi-x-circle" />
          Falso
        </button>
      </div>
    </section>
  );
}
