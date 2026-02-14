const categoryOptions = [
  { value: "all", label: "Todo" },
  { value: "kumite", label: "Kumite" },
  { value: "kata", label: "Kata" },
  { value: "parakarate", label: "Para-Karate" }
];

const questionCountOptions = [10, 15, 20];

export default function ExamSetup({ config, setConfig, availableCount, onStart }) {
  return (
    <section className="card">
      <div className="card-head">
        <i className="bi bi-journal-check" />
        <h2>Configurar examen</h2>
      </div>

      <label className="label">Categoria</label>
      <div className="segment-row">
        {categoryOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`segment ${config.category === item.value ? "active" : ""}`}
            onClick={() => setConfig((prev) => ({ ...prev, category: item.value }))}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className="label">Numero de preguntas</label>
      <div className="segment-row">
        {questionCountOptions.map((count) => (
          <button
            key={count}
            type="button"
            className={`segment ${config.questionCount === count ? "active" : ""}`}
            onClick={() => setConfig((prev) => ({ ...prev, questionCount: count }))}
          >
            {count}
          </button>
        ))}
      </div>

      <p className="meta">Preguntas disponibles: {availableCount}</p>

      <button type="button" className="btn btn-primary" onClick={onStart}>
        <i className="bi bi-play-fill" />
        Iniciar examen
      </button>
    </section>
  );
}
