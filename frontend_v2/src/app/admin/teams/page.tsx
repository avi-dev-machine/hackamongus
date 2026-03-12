"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { adminAPI, leaderboardAPI } from "@/lib/api";
import { Trash2, Plus, UserPlus } from "lucide-react";

export default function TeamsManagement() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ team_name: "", team_lead: "" });
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard();
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.addTeam(newTeam);
      setNewTeam({ team_name: "", team_lead: "" });
      fetchTeams();
    } catch (error) {
      console.error("Add team failed:", error);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (confirm("Are you sure you want to delete this crewmate?")) {
      try {
        await adminAPI.deleteTeam(id);
        fetchTeams();
      } catch (error) {
        console.error("Delete team failed:", error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Team Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 bg-white/5">
            <h2 className="text-xl font-bold text-white font-orbitron mb-6 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-neon-cyan" />
              ADD TEAM
            </h2>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-orbitron uppercase text-gray-400 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-neon-cyan outline-none transition-all"
                  value={newTeam.team_name}
                  onChange={(e) => setNewTeam({ ...newTeam, team_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-orbitron uppercase text-gray-400 mb-1">Team Lead</label>
                <input
                  type="text"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-neon-cyan outline-none transition-all"
                  value={newTeam.team_lead}
                  onChange={(e) => setNewTeam({ ...newTeam, team_lead: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-neon-cyan text-black font-bold py-2 rounded font-orbitron flex items-center justify-center space-x-2 hover:bg-neon-cyan/80 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>REGISTER TEAM</span>
              </button>
            </form>
          </div>
        </div>

        {/* Teams List */}
        <div className="lg:col-span-2">
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-xs font-orbitron text-gray-400 uppercase">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Team Name</th>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {teams.map((team: any) => (
                  <tr key={team.team_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono">#{team.team_id}</td>
                    <td className="px-6 py-4 font-bold text-white">{team.team_name}</td>
                    <td className="px-6 py-4 text-gray-400">{team.team_lead}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDeleteTeam(team.team_id)}
                        className="p-2 text-gray-500 hover:text-neon-red hover:bg-neon-red/10 rounded transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
