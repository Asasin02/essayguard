import { useState, useRef } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [idea, setIdea] = useState("");
  const [text, setText] = useState("");
  const [log, setLog] = useState([]);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);

  const lastTimeRef = useRef(Date.now());

  const handleChange = (e) => {
    const value = e.target.value;
    const now = Date.now();

    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const diff = value.length - text.length;

    setLog((prev) => [
      ...prev,
      { time: now, delta, diff, length: value.length },
    ]);

    setText(value);
  };

  const analyze = () => {
    let suspicious = false;
    let pasteDetected = false;

    for (let i = 0; i < log.length; i++) {
      if (log[i].diff > 20) pasteDetected = true;
      if (log[i].delta < 50 && log[i].diff > 5) suspicious = true;
    }

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    let structureScore = 0;
    if (text.toLowerCase().includes("введение")) structureScore++;
    if (text.toLowerCase().includes("заключение")) structureScore++;

    const ideaMatch = idea
      ? text.toLowerCase().includes(idea.toLowerCase())
      : false;

    setResult({ pasteDetected, suspicious, words, structureScore, ideaMatch });
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
            EssayGuard
          </h1>

          <input
            className="w-full p-3 mb-3 border rounded-lg"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 mb-3 border rounded-lg"
            placeholder="Тема эссе"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            className="w-full p-3 mb-5 border rounded-lg"
            placeholder="Основная мысль"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <button
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => setStarted(true)}
            disabled={!name || !topic}
          >
            Начать написание
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600">Тема: {topic}</p>
          <p className="text-gray-400 text-sm">Идея: {idea || "не указана"}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow mb-4">
          <textarea
            className="w-full h-64 p-4 border rounded-lg"
            placeholder="Начни писать эссе..."
            value={text}
            onChange={handleChange}
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              Слов: {text.trim() ? text.trim().split(/\s+/).length : 0}
            </span>

            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={analyze}
            >
              Проверить
            </button>
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard title="Вставка текста" value={result.pasteDetected ? "Обнаружена" : "Нет"} ok={!result.pasteDetected} />
            <ResultCard title="Подозрительное поведение" value={result.suspicious ? "Да" : "Нет"} ok={!result.suspicious} />
            <ResultCard title="Структура" value={`${result.structureScore}/2`} ok={result.structureScore === 2} />
            <ResultCard title="Совпадение с идеей" value={result.ideaMatch ? "Да" : "Нет"} ok={result.ideaMatch} />
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ title, value, ok }) {
  return (
    <div className={`p-4 rounded-2xl shadow text-white ${ok ? "bg-green-500" : "bg-red-500"}`}>
      <h4 className="text-sm opacity-80">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}