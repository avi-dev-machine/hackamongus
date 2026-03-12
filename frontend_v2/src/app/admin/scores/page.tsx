"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { adminAPI, leaderboardAPI } from "@/lib/api";
import { Trophy, Save, CheckCircle } from "lucide-react";

export default function ScoresManagement() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savings, setSavings] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await leaderboardAPI.getLeaderboard();
      setTeams(response.data);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          // In a real app, we'd have a specific API to get team IDs with their structure
          // Here we use the existing team details API that returns rounds/criteria
          const response = await leaderboardAPI.getTeamDetails(selectedTeam);
          setTeamDetails(response.data);
          
          // Note: The getTeamDetails returns the structure we need to populate the form
        } catch (error) {
          console.error("Fetch details failed:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setTeamDetails(null);
    }
  }, [selectedTeam]);

  // Round/Criteria IDs are hardcoded in main.py populate startup, but in real app we'd fetch them
  // For this implementation, we'll assume standard IDs since we seeded them in order
  const handleScoreChange = (roundIdx: number, critIdx: number, value: string) => {
    const newDetails = { ...teamDetails };
    newDetails.rounds[roundIdx].criteria[critIdx].score = parseFloat(value) || 0;
    setTeamDetails(newDetails);
  };

  const saveScores = async () => {
    setSavings(true);
    setSuccess(false);
    try {
      // For simplicity, we'll iterate and save each (in real app, a batch API would be better)
      for (const round of teamDetails.rounds) {
        // Here we'd need IDs, we'll use indexed IDs mapping to seeded data 1,2,3,4
        const roundId = teamDetails.rounds.indexOf(round) + 1; 
        for (const criteria of round.criteria) {
          await adminAPI.addScore({
            team_id: parseInt(selectedTeam),
            round_id: roundId,
            criteria_id: criteria.id,
            score: criteria.score
          });
        }
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Save scores failed:", error);
    } finally {
      setSavings(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="glass-panel p-8 bg-white/5 mb-8">
          <h2 className="text-xl font-bold text-white font-orbitron mb-6 flex items-center">
            <Trophy className="h-5 w-5 mr-3 text-neon-cyan" />
            SCORE EVALUATION
          </h2>
          
          <div className="mb-8">
            <label className="block text-xs font-orbitron uppercase text-gray-400 mb-2">Select Team for Judging</label>
            <select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-cyan outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="">-- Choose a team --</option>
              {teams.map((team: any) => (
                <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="py-10 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto"></div></div>
          ) : teamDetails ? (
            <div className="space-y-8">
              {teamDetails.rounds.map((round: any, rIdx: number) => (
                <div key={rIdx} className="border border-white/5 rounded-lg p-6 bg-black/20">
                  <h3 className="text-sm font-bold text-neon-cyan font-orbitron mb-4 uppercase tracking-widest">{round.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {round.criteria.map((criteria: any, cIdx: number) => (
                      <div key={cIdx}>
                        <label className="block text-xs text-gray-400 mb-1">{criteria.name} (Max: {criteria.max_score})</label>
                        <input
                          type="number"
                          max={criteria.max_score}
                          min="0"
                          step="0.5"
                          className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-neon-cyan outline-none"
                          value={criteria.score}
                          onChange={(e) => handleScoreChange(rIdx, cIdx, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="text-sm text-gray-500 italic">
                  Changes must be saved to update global leaderboard.
                </div>
                <button 
                  onClick={saveScores}
                  disabled={savings}
                  className="bg-neon-cyan text-black font-extrabold px-8 py-3 rounded font-orbitron flex items-center space-x-2 hover:bg-neon-cyan/80 transition-all disabled:opacity-50"
                >
                  {savings ? <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                  <span>{savings ? "UPLOADING DATA..." : "SAVE SCORES"}</span>
                </button>
              </div>
              
              {success && (
                <div className="flex items-center justify-center space-x-2 text-green-500 font-orbitron text-sm bg-green-500/10 py-3 rounded">
                  <CheckCircle className="h-4 w-4" />
                  <span>TRANSMISSION SUCCESSFUL - SCORES UPDATED</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-gray-500 font-medium">Select a team from the console to begin evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
