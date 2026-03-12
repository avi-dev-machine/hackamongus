"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { leaderboardAPI } from "@/lib/api";
import Link from "next/link";
import { ChevronLeft, User, Award } from "lucide-react";

export default function TeamPage() {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await leaderboardAPI.getTeamDetails(id as string);
        setTeam(response.data);
      } catch (error) {
        console.error("Error fetching team details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (!team) return <div>Team not found</div>;

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-neon-cyan hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Leaderboard
        </Link>

        <div className="glass-panel p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white font-orbitron neon-text-cyan mb-2">
                {team.team_name.toUpperCase()}
              </h1>
              <div className="flex items-center text-gray-400">
                <User className="h-4 w-4 mr-2" />
                <span className="mr-4">Lead: {team.team_lead}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 glass-panel bg-white/5 px-6 py-4 flex items-center">
              <Award className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-orbitron">Total Score</p>
                <p className="text-2xl font-bold text-white font-orbitron">
                  {team.rounds.reduce((acc: number, r: any) => 
                    acc + r.criteria.reduce((cAcc: number, c: any) => cAcc + c.score, 0), 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.rounds.map((round: any) => (
              <div key={round.round_number} className="glass-panel bg-white/5 p-6">
                <h3 className="text-lg font-bold text-neon-cyan font-orbitron mb-4 border-b border-white/10 pb-2">
                  {round.name}
                </h3>
                <div className="space-y-4">
                  {round.criteria.map((c: any) => (
                    <div key={c.name} className="flex justify-between items-center">
                      <span className="text-gray-300">{c.name}</span>
                      <div className="flex items-center">
                        <span className="text-white font-bold mr-2">{c.score}</span>
                        <span className="text-gray-500 text-xs">/ {c.max_score}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold text-white uppercase text-xs font-orbitron">Round Total</span>
                    <span className="font-bold text-white font-orbitron">
                      {round.criteria.reduce((acc: number, c: any) => acc + c.score, 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
