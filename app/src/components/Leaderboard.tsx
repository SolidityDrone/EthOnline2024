'use client';

import React, { useEffect, useState } from 'react';

// Define the types for the leaderboard data
interface LeaderboardEntry {
  address: string;
  score: number;
}

// Modal Component to display leaderboard
const LeaderboardModal: React.FC<{ leaderboard: LeaderboardEntry[] }> = ({ leaderboard }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div>
      <button
        onClick={toggleModal}
        className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Leaderboard
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-sky-950 border-2 border-blue-400 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] w-full max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-blue-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              <button
                onClick={toggleModal}
                className="text-white hover:text-blue-300 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-grow">
              <table className="min-w-full divide-y divide-gray-200 bg-sky-900 text-white">
                <thead className="bg-sky-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">

                  {leaderboard.map((entry, index) => (<>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.score}</td>

                  </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Leaderboard Component
const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STACKR_URL}/leaderboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data: LeaderboardEntry[] = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to fetch leaderboard');
      }
    };

    fetchLeaderboard();
  }, []);


  return (
    <div className="p-4">
      {/* Pass the leaderboard data to the LeaderboardModal */}
      <LeaderboardModal leaderboard={leaderboard} />
    </div>
  );
};

export default Leaderboard;
