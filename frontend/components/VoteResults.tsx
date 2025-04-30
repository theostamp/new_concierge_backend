'use client';

import React from 'react';

type VoteResultsProps = {
  readonly results: {
    readonly ΝΑΙ: number;
    readonly ΟΧΙ: number;
    readonly ΛΕΥΚΟ: number;
    readonly total: number;
  };
};

export default function VoteResults({ results }: VoteResultsProps) {
  const { ΝΑΙ, ΟΧΙ, ΛΕΥΚΟ, total } = results;

  const percent = (count: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
      <h3 className="font-bold mb-2">📊 Αποτελέσματα Ψηφοφορίας</h3>
      <div className="space-y-2 text-sm">
        <Bar label="✅ ΝΑΙ" value={ΝΑΙ} percent={percent(ΝΑΙ)} color="bg-green-500" />
        <Bar label="❌ ΟΧΙ" value={ΟΧΙ} percent={percent(ΟΧΙ)} color="bg-red-500" />
        <Bar label="⬜ ΛΕΥΚΟ" value={ΛΕΥΚΟ} percent={percent(ΛΕΥΚΟ)} color="bg-gray-400" />
        <p className="text-xs text-gray-500 pt-2">Συνολικές ψήφοι: {total}</p>
      </div>
    </div>
  );
}

type BarProps = {
  readonly label: string;
  readonly value: number;
  readonly percent: number;
  readonly color: string;
};

function Bar({
  label,
  value,
  percent,
  color,
}: BarProps) {
  return (
    <div>
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded">
        <div
          className={`${color} h-3 rounded`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
