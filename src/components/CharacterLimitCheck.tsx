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
  let progressColor = "bg-emerald-500";
  let ringColor = "focus:ring-emerald-500/20";
  let borderColor = "focus:border-emerald-500";

  if (isExceeded) {
    progressColor = "bg-red-500";
    ringColor = "focus:ring-red-500/20";
    borderColor = "focus:border-red-500";
  } else if (percentage > 90) {
    progressColor = "bg-amber-500";
    ringColor = "focus:ring-amber-500/20";
    borderColor = "focus:border-amber-500";
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <span className={`text-xs font-medium transition-colors ${
          isExceeded ? 'text-red-600' : 'text-slate-400'
        }`}>
          {count} / {limit}
        </span>
      </div>

      <div className="relative group">
        <textarea
          className={`w-full ${height} p-3 pb-8 text-slate-900 bg-white border rounded-lg resize-none
            transition-all duration-200 ease-in-out outline-none
            ${isExceeded ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'}
            ${isFocused ? `ring-4 ${ringColor} ${borderColor}` : ''}
            placeholder:text-slate-400 text-sm leading-relaxed`}
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
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Clear text"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
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
            className="flex items-center gap-1.5 text-red-600 text-xs mt-1 overflow-hidden"
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
  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Character Limit Check
        </h1>
        <p className="text-slate-500 text-sm">
          Simple text validation tool
        </p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
        <TextField
          label="Long Caption"
          limit={2000}
          height="h-48"
          placeholder="Enter detailed text..."
        />

        <div className="h-px bg-slate-100 w-full" />

        <TextField
          label="Medium Caption"
          limit={500}
          height="h-32"
          placeholder="Enter summary..."
        />

        <div className="h-px bg-slate-100 w-full" />

        <TextField
          label="Short Caption"
          limit={300}
          height="h-24"
          placeholder="Enter tags or keywords..."
        />
      </div>
    </div>
  );
}
