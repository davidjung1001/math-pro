import React from 'react';

const GRADE_LEVELS = [
  'K - Kindergarten',
  '1 - 1st Grade',
  '2 - 2nd Grade',
  '3 - 3rd Grade',
  '4 - 4th Grade',
  '5 - 5th Grade',
  '6 - 6th Grade',
  '7 - 7th Grade',
  '8 - Pre-Algebra',
  '9 - Algebra 1',
  '10 - Geometry',
  '10 - Algebra 2',
  '11 - Algebra 2',
  '11 - Pre-Calculus',
  '12 - Pre-Calculus',
  '12 - AP Calculus AB',
  '12 - AP Calculus BC',
  '12 - AP Statistics',
  'College - Calculus',
  'College - Statistics',
  'College - Linear Algebra',
];

const toggleGradeLevel = (editingQuestion, setEditingQuestion, level) => {
  const current = editingQuestion.grade_levels || [];
  const updated = current.includes(level)
    ? current.filter(l => l !== level)
    : [...current, level];
  setEditingQuestion({ ...editingQuestion, grade_levels: updated });
};

export const EditModal = ({ editingQuestion, setEditingQuestion, saveQuestion }) => {

    const options = ['a', 'b', 'c', 'd'];

    const swapOption = (opt, direction) => {
        const order = [...options];
        const index = order.indexOf(opt);
        let swapIndex;
        if (direction === 'up') swapIndex = index - 1;
        else swapIndex = index + 1;

        if (swapIndex < 0 || swapIndex > 3) return;

        const newEditing = { ...editingQuestion };
        // Swap the option text
        const temp = newEditing[`option_${order[index]}`];
        newEditing[`option_${order[index]}`] = newEditing[`option_${order[swapIndex]}`];
        newEditing[`option_${order[swapIndex]}`] = temp;

        // Swap correct_option if needed
        if (newEditing.correct_option === order[index]) newEditing.correct_option = order[swapIndex];
        else if (newEditing.correct_option === order[swapIndex]) newEditing.correct_option = order[index];

        setEditingQuestion(newEditing);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Edit Question #{editingQuestion.id}</h3>
                    <button onClick={() => setEditingQuestion(null)} className="text-gray-500 hover:text-gray-700">X</button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
                        <textarea
                            value={editingQuestion.question_text || ''}
                            onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] text-sm"
                            placeholder="Enter question text..."
                        />
                    </div>

                    {/* Options with swap buttons */}
                    {options.map(opt => (
                        <div key={opt} className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-700">{opt.toUpperCase()}.</span>
                            <textarea
                                value={editingQuestion[`option_${opt}`] || ''}
                                onChange={e => setEditingQuestion({ ...editingQuestion, [`option_${opt}`]: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[60px] text-sm ${
                                    editingQuestion.correct_option === opt ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                }`}
                                placeholder={`Enter option ${opt.toUpperCase()}...`}
                            />
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => swapOption(opt, 'up')}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => swapOption(opt, 'down')}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                                >
                                    ↓
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Correct Answer Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answer</label>
                        <select
                            value={editingQuestion.correct_option || ''}
                            onChange={e => setEditingQuestion({ ...editingQuestion, correct_option: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select correct option</option>
                            {options.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grade Levels */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Grade Levels
                            <span className="ml-2 text-xs text-gray-400 font-normal">
                                ({(editingQuestion.grade_levels || []).length} selected)
                            </span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {GRADE_LEVELS.map(level => {
                                const selected = (editingQuestion.grade_levels || []).includes(level);
                                return (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => toggleGradeLevel(editingQuestion, setEditingQuestion, level)}
                                        className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                            selected
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                    <button
                        onClick={saveQuestion}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
