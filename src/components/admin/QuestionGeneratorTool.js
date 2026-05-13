'use client';

import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Play, Square, Download, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader } from 'lucide-react';

const DEFAULT_SUBSECTIONS = [
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Introduction and Prerequisite', subsection_title: 'Solving Linear Equations' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Introduction and Prerequisite', subsection_title: 'Solving Quadratic Equations' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'No Solution One Solution Infinitely Many Solutions Destroyer', subsection_title: 'Lines' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'No Solution One Solution Infinitely Many Solutions Destroyer', subsection_title: 'Linear Equations' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Percentage Questions Destroyer', subsection_title: 'Percent of a Quantity' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Percentage Questions Destroyer', subsection_title: 'Percent Increase and Decrease' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Circles Destroyer', subsection_title: 'Circle Equations' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Circles Destroyer', subsection_title: 'Sectors and Area' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Circles Destroyer', subsection_title: 'Arc and Circumference' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Trigonometry Destroyer', subsection_title: 'Special Right Triangles' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Trigonometry Destroyer', subsection_title: 'Trigonometry Ratios' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Lines Destroyer', subsection_title: 'Equation From Two Points' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Lines Destroyer', subsection_title: 'Linear Equations Word Problems' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Quadratics Destroyer', subsection_title: 'Factoring With Coefficient of One' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Quadratics Destroyer', subsection_title: 'One Two No Solutions' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Quadratics Destroyer', subsection_title: 'Maximum and Minimum' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Rational Function Destroyer', subsection_title: 'Solving Rational Equations' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Quadratics Destroyer', subsection_title: 'Asymptotes' },
  { course: 'SAT Math Destroyer Crash Course', section_title: 'Graph Transformation Destroyer', subsection_title: 'Parent Function Transformation' },
];

const CSV_FIELDS = [
  'course', 'section_title', 'subsection_title', 'set_number', 'difficulty',
  'sort_order', 'question_text', 'image_url', 'option_a', 'option_b',
  'option_c', 'option_d', 'correct_option', 'correct_answer_text', 'premium', 'short_explanation',
];

function escapeCsvCell(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(questions) {
  const header = CSV_FIELDS.join(',');
  const rows = questions.map(q =>
    CSV_FIELDS.map(f => escapeCsvCell(q[f])).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `generated_questions_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function QuestionGeneratorTool() {
  const [topics, setTopics] = useState(DEFAULT_SUBSECTIONS);
  const [setsPerSubsection, setSetsPerSubsection] = useState(5);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('mastery');
  const [premiumForMastery, setPremiumForMastery] = useState(true);

  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [expandedLog, setExpandedLog] = useState(true);

  // New topic form
  const [newTopic, setNewTopic] = useState({ course: '', section_title: '', subsection_title: '' });

  const stopRef = useRef(false);
  const logRef = useRef(null);

  const addLog = useCallback((msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 50);
  }, []);

  const handleStart = async () => {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    setAllQuestions([]);
    setLog([]);

    const total = topics.length * setsPerSubsection;
    setProgress({ current: 0, total });

    let collected = [];
    let done = 0;

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      for (let setNum = 1; setNum <= setsPerSubsection; setNum++) {
        if (stopRef.current) {
          addLog('Generation stopped by user.', 'warn');
          break;
        }

        const isPremium = difficulty === 'mastery' ? premiumForMastery : false;
        addLog(`Generating Set ${setNum}/${setsPerSubsection} — ${topic.subsection_title} (${difficulty})...`, 'info');

        try {
          const res = await fetch('/api/admin/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              course: topic.course,
              section_title: topic.section_title,
              subsection_title: topic.subsection_title,
              set_number: setNum,
              num_questions: numQuestions,
              difficulty,
              premium: isPremium,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            addLog(`  ✗ Error: ${data.error || 'Unknown error'}`, 'error');
          } else {
            collected = [...collected, ...data.questions];
            setAllQuestions([...collected]);
            addLog(`  ✓ ${data.questions.length} questions received`, 'success');
          }
        } catch (err) {
          addLog(`  ✗ Network error: ${err.message}`, 'error');
        }

        done++;
        setProgress({ current: done, total });
      }

      if (stopRef.current) break;
    }

    addLog(`Done. Total questions generated: ${collected.length}`, 'success');
    setRunning(false);
  };

  const handleStop = () => {
    stopRef.current = true;
  };

  const handleAddTopic = () => {
    if (!newTopic.course.trim() || !newTopic.section_title.trim() || !newTopic.subsection_title.trim()) return;
    setTopics(prev => [...prev, { ...newTopic }]);
    setNewTopic({ course: '', section_title: '', subsection_title: '' });
  };

  const handleRemoveTopic = (idx) => {
    setTopics(prev => prev.filter((_, i) => i !== idx));
  };

  const progressPct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Question Generator</h1>
          <p className="text-gray-500 mt-1">Generate practice questions via OpenAI and export to CSV.</p>
        </div>

        {/* Settings + Topics side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Generation Settings</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets Per Subsection</label>
              <input
                type="number" min={1} max={20}
                value={setsPerSubsection}
                onChange={e => setSetsPerSubsection(Number(e.target.value))}
                disabled={running}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Questions Per Set</label>
              <input
                type="number" min={1} max={30}
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                disabled={running}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                disabled={running}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="foundation">Foundation</option>
                <option value="mastery">Mastery</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="premiumCheck"
                checked={premiumForMastery}
                onChange={e => setPremiumForMastery(e.target.checked)}
                disabled={running}
                className="w-4 h-4 accent-indigo-600"
              />
              <label htmlFor="premiumCheck" className="text-sm text-gray-700">Mark as Premium</label>
            </div>

            <div className="pt-2 space-y-2">
              <div className="text-sm text-gray-500">
                Total requests: <span className="font-semibold text-gray-800">{topics.length * setsPerSubsection}</span>
                &nbsp;({topics.length * setsPerSubsection * numQuestions} questions)
              </div>

              {!running ? (
                <button
                  onClick={handleStart}
                  disabled={topics.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" /> Start Generation
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
                >
                  <Square className="w-4 h-4" /> Stop
                </button>
              )}

              {allQuestions.length > 0 && (
                <button
                  onClick={() => downloadCsv(allQuestions)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
                >
                  <Download className="w-4 h-4" /> Download CSV ({allQuestions.length} Qs)
                </button>
              )}
            </div>
          </div>

          {/* Right: Topics List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Topics ({topics.length})</h2>

            {/* Add new topic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                placeholder="Course"
                value={newTopic.course}
                onChange={e => setNewTopic(p => ({ ...p, course: e.target.value }))}
                disabled={running}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              />
              <input
                placeholder="Section Title"
                value={newTopic.section_title}
                onChange={e => setNewTopic(p => ({ ...p, section_title: e.target.value }))}
                disabled={running}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              />
              <div className="flex gap-2">
                <input
                  placeholder="Subsection Title"
                  value={newTopic.subsection_title}
                  onChange={e => setNewTopic(p => ({ ...p, subsection_title: e.target.value }))}
                  disabled={running}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                />
                <button
                  onClick={handleAddTopic}
                  disabled={running}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Topics table */}
            <div className="overflow-auto max-h-72 border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">#</th>
                    <th className="text-left px-3 py-2 font-medium">Course</th>
                    <th className="text-left px-3 py-2 font-medium">Section</th>
                    <th className="text-left px-3 py-2 font-medium">Subsection</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((t, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 text-gray-700 max-w-[140px] truncate">{t.course}</td>
                      <td className="px-3 py-2 text-gray-700 max-w-[160px] truncate">{t.section_title}</td>
                      <td className="px-3 py-2 text-gray-700 max-w-[160px] truncate">{t.subsection_title}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleRemoveTopic(i)}
                          disabled={running}
                          className="text-red-400 hover:text-red-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {progress.total > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{progress.current} / {progress.total} requests ({progressPct}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Log */}
        {log.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <button
              onClick={() => setExpandedLog(p => !p)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 w-full text-left mb-3"
            >
              {expandedLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Generation Log ({log.length} entries)
            </button>
            {expandedLog && (
              <div
                ref={logRef}
                className="bg-gray-950 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs space-y-0.5"
              >
                {log.map((entry, i) => (
                  <div key={i} className={
                    entry.type === 'success' ? 'text-green-400' :
                    entry.type === 'error' ? 'text-red-400' :
                    entry.type === 'warn' ? 'text-yellow-400' :
                    'text-gray-300'
                  }>
                    <span className="text-gray-600 mr-2">[{entry.time}]</span>{entry.msg}
                  </div>
                ))}
                {running && (
                  <div className="text-indigo-400 animate-pulse flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin inline" /> Running...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results preview */}
        {allQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Generated Questions ({allQuestions.length})
              </h2>
              <button
                onClick={() => downloadCsv(allQuestions)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-auto max-h-96 border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                  <tr>
                    {['#', 'Set', 'Subsection', 'Difficulty', 'Question', 'Answer'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allQuestions.map((q, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 text-gray-700">{q.set_number}</td>
                      <td className="px-3 py-2 text-gray-700 max-w-[160px] truncate">{q.subsection_title}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          q.difficulty === 'mastery' ? 'bg-purple-100 text-purple-700' :
                          q.difficulty === 'foundation' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700 max-w-[280px] truncate">{q.question_text}</td>
                      <td className="px-3 py-2 font-semibold text-indigo-600">{q.correct_option}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
