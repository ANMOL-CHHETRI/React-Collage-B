import { useState } from "react";

const QUIZ_QUESTIONS = [
  {
    question: "Who is known as the founder of modern Nepal?",
    options: ["Prithvi Narayan Shah", "Tribhuvan", "Birendra", "Jung Bahadur Rana"],
    answer: "Prithvi Narayan Shah"
  },
  {
    question: "Which treaty ended the Anglo-Nepalese War in 1816?",
    options: ["Treaty of Sugauli", "Treaty of Versailles", "Treaty of Paris", "Treaty of Kathmandu"],
    answer: "Treaty of Sugauli"
  },
  {
    question: "Who was the first elected Prime Minister of Nepal?",
    options: ["Bishweshwar Prasad Koirala", "Girija Prasad Koirala", "Pushpa Kamal Dahal", "Sher Bahadur Deuba"],
    answer: "Bishweshwar Prasad Koirala"
  },
  {
    question: "In which year did Nepal become a Federal Democratic Republic?",
    options: ["2008", "2001", "1990", "2015"],
    answer: "2008"
  },
  {
    question: "What is the historical name of the Kathmandu Valley?",
    options: ["Nepal Mandala", "Gorkha", "Kantipur", "Lalitpur"],
    answer: "Nepal Mandala"
  }
];

const HistoryQuiz = ({ isOpen, onClose, onWin }) => {
  const [currentQuestion, setCurrentQuestion] = useState(() => 
    QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]
  );
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [won, setWon] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === currentQuestion.answer;
    setWon(isCorrect);
    setShowResult(true);
  };

  const handleClaim = () => {
    onWin("FESTIVAL20");
    onClose();
  };

  const handleClose = () => {
    // Reset state for next time
    setTimeout(() => {
      setCurrentQuestion(QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]);
      setSelectedAnswer("");
      setShowResult(false);
      setWon(false);
    }, 300);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-fade-in-up border border-slate-200 dark:border-slate-800">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
            🇳🇵
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nepal History Quiz</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Answer correctly to win a 20% discount code!</p>
        </div>

        {!showResult ? (
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">{currentQuestion.question}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => (
                <label 
                  key={opt}
                  className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedAnswer === opt 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md shadow-amber-500/10' 
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === opt ? 'border-amber-500' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedAnswer === opt && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                    <span className={`font-medium ${selectedAnswer === opt ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {opt}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="text-center py-4 animate-fade-in-up">
            {won ? (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Correct!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">You really know your history. Here is your 20% discount code!</p>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 mb-6">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-widest">FESTIVAL20</span>
                </div>
                <button 
                  onClick={handleClaim}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition"
                >
                  Apply to Cart
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Incorrect</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  The correct answer was <span className="font-bold text-slate-800 dark:text-slate-200">{currentQuestion.answer}</span>. Better luck next time!
                </p>
                <button 
                  onClick={handleClose}
                  className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-md transition"
                >
                  Continue to Cart
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryQuiz;
