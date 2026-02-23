import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';

interface TextFieldProps {
  limit: number;
  label: string;
  height?: string;
  placeholder?: string;
}

const TextField = ({ limit, label, height = "h-32", placeholder }: TextFieldProps) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const count = text.length;
  const isExceeded = count > limit;
  const percentage = Math.min((count / limit) * 100, 100);

  // Clean, functional colors
  let progressColor = "bg-blue-600 dark:bg-blue-500";
  let ringColor = "focus:ring-blue-600/20 dark:focus:ring-blue-500/20";
  let borderColor = "focus:border-blue-600 dark:focus:border-blue-500";

  if (isExceeded) {
    progressColor = "bg-red-500 dark:bg-red-400";
    ringColor = "focus:ring-red-500/20 dark:focus:ring-red-400/20";
    borderColor = "focus:border-red-500 dark:focus:border-red-400";
  } else if (percentage > 90) {
    progressColor = "bg-amber-500 dark:bg-amber-400";
    ringColor = "focus:ring-amber-500/20 dark:focus:ring-amber-400/20";
    borderColor = "focus:border-amber-500 dark:focus:border-amber-400";
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className={`text-xs font-medium transition-colors ${
          isExceeded ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
        }`}>
          {count} / {limit}
        </span>
      </div>

      <div className="relative group">
        <textarea
          className={`w-full ${height} p-3 pb-8 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border rounded-lg resize-none
            transition-all duration-200 ease-in-out outline-none
            ${isExceeded ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
            ${isFocused ? `ring-4 ${ringColor} ${borderColor}` : ''}
            placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm leading-relaxed`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          spellCheck={false}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {text.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setText('')}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Clear text"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
        <motion.div
          className={`h-full ${progressColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {isExceeded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs mt-1 overflow-hidden"
          >
            <AlertCircle size={12} />
            <span>Character limit exceeded by {count - limit}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CharacterLimitCheck() {
  const [selectedOption, setSelectedOption] = useState('long');
  const [customLimit, setCustomLimit] = useState(100);

  const options = [
    { id: 'long', label: 'Long Caption', limit: 2000, height: 'h-48', placeholder: 'Enter detailed text...' },
    { id: 'medium', label: 'Medium Caption', limit: 500, height: 'h-32', placeholder: 'Enter summary...' },
    { id: 'short', label: 'Short Caption', limit: 300, height: 'h-24', placeholder: 'Enter tags or keywords...' },
    { id: 'custom', label: 'Custom', limit: customLimit, height: 'h-32', placeholder: `Enter text (limit: ${customLimit})...` },
  ];

  const currentOption = options.find(o => o.id === selectedOption) || options[0];

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Character Limit Check
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Simple text validation tool
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedOption === option.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom Limit Input */}
        <AnimatePresence>
          {selectedOption === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 justify-center pb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Set Limit:
                </label>
                <input
                  type="number"
                  value={customLimit}
                  onChange={(e) => setCustomLimit(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-24 px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <TextField
          label={selectedOption === 'custom' ? `Custom Length (${customLimit})` : currentOption.label}
          limit={selectedOption === 'custom' ? customLimit : currentOption.limit}
          height={currentOption.height}
          placeholder={currentOption.placeholder}
        />
      </div>
    </div>
  );
}

