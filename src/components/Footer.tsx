import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          Designed & Built by{' '}
          <a 
            href="https://joyalsiby.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Joyal Siby
          </a>
        </p>
        <p className="mt-2 sm:mt-0">Product & Systems Designer</p>
      </div>
    </footer>
  );
}
