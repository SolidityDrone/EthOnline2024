'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import avail_logo  from "@/assets/icons/avail.png"
import tia_logo from "@/assets/icons/celestia.png"
// Define types for history data and modal props
type Game = {
    id: string;
    player: string;
    score: number;
    hash: string;
    blockStatus: string;
    celestiaTxHash?: string;
    availTxHash?: string;
    l1TransactionHash?: string;
};

interface ModalProps {
    games: Game[];
}
const formatHash = (hash?: string) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const Modal: React.FC<ModalProps> = ({ games }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <div>
            <button
                onClick={toggleModal}
                className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                Games
            </button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="p-4 border-b border-blue-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Match history</h2>
                            <button
                                onClick={toggleModal}
                                className="text-white hover:text-blue-300 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-x-auto flex-grow">
                            <table className="min-w-full divide-y divide-gray-200 bg-sky-900 text-white">
                                <thead className="bg-sky-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Block Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">DA</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">DA Tx hash</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">L1 Transaction Hash</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {games.map((game, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{game.score ?? 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{game.blockStatus}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{game.celestiaTxHash ? 'Celestia' : 'Avail'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {game.celestiaTxHash ? (
                                                    <a
                                                        href={`https://mocha-4.celenium.io/tx/${game.celestiaTxHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:underline"
                                                    ><span className='flex items-center'>
                                                          <img src={tia_logo.src} alt="Celestia Logo" className="w-4 h-4 mr-2" />
                                                          {formatHash(game.celestiaTxHash)}
                                                    </span>
                                                     
                                                    </a>
                                                ) : game.availTxHash ? (
                                                    <a
                                                        href={`https://avail-turing.subscan.io/extrinsic/${game.availTxHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:underline"
                                                    >
                                                       <span className="flex items-center">
    <img src={avail_logo.src} alt="Avail Logo" className="w-4 h-4 mr-2" />
    {formatHash(game.availTxHash)}
</span>
                                                    </a>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a
                                                    href={`https://sepolia.etherscan.io/tx/${game.l1TransactionHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:underline"
                                                >
                                                    {formatHash(game.l1TransactionHash) ?? 'not finalized'}
                                                </a>
                                            </td>
                                        </tr>
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

// Define types for the history data
interface CELESTIA_METADATA {
    blockHeight: number;
    txHash: string;
}

interface AVAIL_METADATA {
    blockHeight: number;
    extIdx: number;
}

interface BlockInfo {
    status: string;
    daMetadata?: {
        celestia?: CELESTIA_METADATA;
        avail?: AVAIL_METADATA;
    };
    l1TxHash?: string;
}

interface HistoryEntry {
    gameId: string;
    score: string;
    hash: string;
    player: string;  // Add the player field here
    blockInfo: BlockInfo | null;
}

const History: React.FC = () => {
    const { address } = useAccount(); // Get the logged address from wagmi
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STACKR_URL}/history?address=${address}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                const data: HistoryEntry[] = await response.json();
                setHistory(data);
            } catch (err) {
                setError('Failed to fetch history');
            }
        };

        if (address) {
            fetchHistory();
        }
    }, [address]);


    
    const games: Game[] = history.map((entry) => ({
        id: entry.gameId,
        score: parseFloat(entry.score), // Convert the score to a number
        hash: entry.hash,
        player: entry.player, // Ensure player is correctly mapped
        blockStatus: entry.blockInfo?.status || 'unknown',
        celestiaTxHash: entry.blockInfo?.daMetadata?.celestia?.txHash,
        availTxHash: entry.blockInfo?.daMetadata?.avail
            ? `${entry.blockInfo.daMetadata.avail.blockHeight}-${entry.blockInfo.daMetadata.avail.extIdx}`
            : undefined,
        l1TransactionHash: entry.blockInfo?.l1TxHash,
    }));
    
    return (
        <div className="p-4">
            {/* Pass the games data to the Modal */}
            <Modal games={games} />
        </div>
    );
};

export default History;
