"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface Team {
  rank: number;
  team_id: number;
  team_name: string;
  team_lead: string;
  total_score: number;
  rank_change?: number;
}

interface LeaderboardTableProps {
  teams: Team[];
}

export default function LeaderboardTable({ teams }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto glass-panel p-4">
      <table className="min-w-full divide-y divide-white/10">
        <thead>
          <tr className="text-left text-xs font-orbitron uppercase tracking-wider text-neon-cyan">
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Team Name</th>
            <th className="px-6 py-4">Team Lead</th>
            <th className="px-6 py-4 text-right">Total Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-medium">
          {teams.map((team) => (
            <tr 
              key={team.team_id}
              className="hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <span className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                    ${team.rank === 1 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 
                      team.rank === 2 ? 'bg-gray-300 text-black' :
                      team.rank === 3 ? 'bg-amber-600 text-black' : 'bg-white/10 text-white'}
                  `}>
                    {team.rank}
                  </span>
                  {team.rank_change !== undefined && team.rank_change !== null && (
                    <div className="flex items-center w-8">
                      {team.rank_change > 0 ? (
                        <div className="flex items-center text-green-500" title={`Up ${team.rank_change} places`}>
                          <ArrowUp className="h-4 w-4" />
                          <span className="text-xs font-bold ml-1">{team.rank_change}</span>
                        </div>
                      ) : team.rank_change < 0 ? (
                        <div className="flex items-center text-red-500" title={`Down ${Math.abs(team.rank_change)} places`}>
                          <ArrowDown className="h-4 w-4" />
                          <span className="text-xs font-bold ml-1">{Math.abs(team.rank_change)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500" title="No change">
                          <Minus className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/team/${team.team_id}`} className="group-hover:text-neon-cyan transition-colors">
                  {team.team_name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {team.team_lead}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-orbitron text-white">
                {team.total_score.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
