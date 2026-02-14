export default function ExamResult({ result, onRestart }) {
  return (
    <section className="card">
      <div className="card-head">
        <i className="bi bi-award" />
        <h2>Resultado</h2>
      </div>

      <div className="score">{result.scorePercent}%</div>
      <p className="meta">{result.correctCount} correctas de {result.totalQuestions}</p>
      <p className="meta">Intento #{result.attemptNumber}</p>

      <button type="button" className="btn btn-primary" onClick={onRestart}>
        <i className="bi bi-arrow-repeat" />
        Nuevo examen
      </button>
    </section>
  );
}
