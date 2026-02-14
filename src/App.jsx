import { useEffect, useMemo, useState } from "react";
import ExamSetup from "./components/ExamSetup";
import ExamRunner from "./components/ExamRunner";
import ExamResult from "./components/ExamResult";
import { supabase } from "./supabaseClient";
import { fallbackQuestions } from "./data/fallbackQuestions";

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  const [config, setConfig] = useState({ category: "all", questionCount: 10 });
  const [status, setStatus] = useState("setup");
  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadQuestions() {
      setLoading(true);
      setError("");

      if (!supabase) {
        setQuestions(fallbackQuestions);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("questions")
        .select("id, category, statement, correct_answer")
        .eq("is_active", true);

      if (!active) {
        return;
      }

      if (fetchError) {
        setError("No se pudieron cargar preguntas de Supabase. Se usa banco local.");
        setQuestions(fallbackQuestions);
      } else {
        setQuestions(data || []);
      }

      setLoading(false);
    }

    loadQuestions();

    return () => {
      active = false;
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    if (config.category === "all") {
      return questions;
    }
    return questions.filter((q) => q.category === config.category);
  }, [questions, config.category]);

  const startExam = () => {
    if (!filteredQuestions.length) {
      setError("No hay preguntas para esa categoria.");
      return;
    }

    const selected = shuffle(filteredQuestions).slice(0, config.questionCount);
    setExamQuestions(selected);
    setAnswers([]);
    setCurrent(0);
    setResult(null);
    setFeedback(null);
    setStatus("exam");
    setError("");
  };

  const persistAttempt = async (nextAnswers, summary) => {
    if (!supabase) {
      return;
    }

    const { data: attemptRow, error: attemptError } = await supabase
      .from("exam_attempts")
      .insert({
        total_questions: summary.totalQuestions,
        correct_count: summary.correctCount,
        score_percent: summary.scorePercent
      })
      .select("id")
      .single();

    if (attemptError || !attemptRow) {
      return;
    }

    const answerRows = nextAnswers
      .filter((a) => a.questionId)
      .map((a) => ({
        attempt_id: attemptRow.id,
        question_id: a.questionId,
        selected_answer: a.selected,
        is_correct: a.isCorrect
      }));

    if (answerRows.length) {
      await supabase.from("exam_attempt_answers").insert(answerRows);
    }
  };

  const finishExam = async (finalAnswers) => {
    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = examQuestions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    const summary = {
      correctCount,
      totalQuestions,
      scorePercent,
      attemptNumber: attemptCount + 1
    };

    setResult(summary);
    setAttemptCount((prev) => prev + 1);
    setStatus("result");
    setFeedback(null);

    await persistAttempt(finalAnswers, summary);
  };

  const answerQuestion = (selected) => {
    if (feedback) {
      return;
    }

    const q = examQuestions[current];
    const answer = {
      questionId: q.id || null,
      selected,
      isCorrect: selected === q.correct_answer
    };

    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setFeedback({
      selected,
      isCorrect: answer.isCorrect,
      correctAnswer: q.correct_answer
    });
  };

  const goNext = async () => {
    if (!feedback) {
      return;
    }

    if (current + 1 < examQuestions.length) {
      setCurrent((prev) => prev + 1);
      setFeedback(null);
      return;
    }

    await finishExam(answers);
  };

  return (
    <main className="app">
      <header className="header">
        <h1>WKF Exam Trainer</h1>
        <p>Kata, Kumite y Para-Karate</p>
      </header>

      {loading && <section className="card">Cargando preguntas...</section>}

      {!loading && status === "setup" && (
        <ExamSetup
          config={config}
          setConfig={setConfig}
          availableCount={filteredQuestions.length}
          onStart={startExam}
        />
      )}

      {!loading && status === "exam" && examQuestions[current] && (
        <ExamRunner
          question={examQuestions[current]}
          index={current}
          total={examQuestions.length}
          onAnswer={answerQuestion}
          feedback={feedback}
          onNext={goNext}
          isLastQuestion={current + 1 === examQuestions.length}
        />
      )}

      {!loading && status === "result" && result && (
        <ExamResult
          result={result}
          onRestart={() => setStatus("setup")}
        />
      )}

      {error && <p className="error">{error}</p>}

      <footer className="footer">Copyright © Joshua Jara</footer>
    </main>
  );
}
