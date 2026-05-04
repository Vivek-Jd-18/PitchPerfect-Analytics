'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface UpdateContractFormProps {
  playerId: string;
  currentGrade: 'A' | 'B' | 'C' | string;
  onSuccess?: () => void;
}

export const UpdateContractForm: React.FC<UpdateContractFormProps> = ({ playerId, currentGrade, onSuccess }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>(currentGrade || 'C');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/contracts/${playerId}/promote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newGrade: selectedGrade }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update contract');
      }

      if (onSuccess) onSuccess();
      
      // Reset form or show success message (handled by parent mostly)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Update Contract Tier</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Contract Grade
          </label>
          <select
            id="grade"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
          >
            <option value="A">Grade A (Premium)</option>
            <option value="B">Grade B (Standard)</option>
            <option value="C">Grade C (Development)</option>
          </select>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">{error}</div>}

        <button
          type="submit"
          disabled={loading || selectedGrade === currentGrade}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading || selectedGrade === currentGrade ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500'}
          `}
        >
          {loading ? 'Processing...' : 'Confirm Update'}
        </button>
      </form>
    </div>
  );
};
