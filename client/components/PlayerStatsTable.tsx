'use client';

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const GET_PLAYER_PROFILE = gql`
  query GetPlayerProfile($id: ID!) {
    getPlayerProfile(id: $id) {
      id
      name
      role
      nationality
      contract {
        grade
        baseSalary
      }
      recentMatches {
        matchId
        runs
        isWicket
        createdAt
      }
    }
  }
`;

interface PlayerStatsTableProps {
  playerId: string;
}

export const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ playerId }) => {
  const { data, loading, error } = useQuery(GET_PLAYER_PROFILE, {
    variables: { id: playerId },
    skip: !playerId,
  });

  const searchQuery = useSelector((state: RootState) => state.rosterFilter.searchQuery);

  if (!playerId) return <div className="text-gray-500">Select a player to view stats.</div>;
  if (loading) return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-gray-300 rounded w-3/4"></div></div>;
  if (error) return <div className="text-red-500 font-medium">Error loading player data: {error.message}</div>;

  const player = data?.getPlayerProfile;
  if (!player) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">
          {player.name} <span className="text-sm font-normal text-gray-500">({player.role})</span>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {player.nationality} &bull; Contract: {player.contract?.grade || 'None'}
        </p>
      </div>
      <div className="px-6 py-5">
        <h4 className="font-medium text-gray-800 mb-4">Recent Form (Last 10 Matches)</h4>
        {player.recentMatches.length === 0 ? (
          <p className="text-sm text-gray-500">No recent matches found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wicket Taken</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {player.recentMatches.map((match: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.runs}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.isWicket ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
