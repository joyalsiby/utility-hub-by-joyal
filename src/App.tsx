/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CharacterLimitCheck from './components/CharacterLimitCheck';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
    <div className="bg-indigo-50 p-6 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    </div>
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-slate-900">Welcome to Utility Hub</h1>
      <p className="text-slate-500 max-w-md mx-auto">
        Select a utility from the sidebar to get started. More tools coming soon.
      </p>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto h-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/character-limit" element={
              <div className="flex justify-center pt-12">
                <CharacterLimitCheck />
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}
