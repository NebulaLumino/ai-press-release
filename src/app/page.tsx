"use client";
import { useState } from "react";

export default function PressReleasePage() {
  const [company, setCompany] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [audience, setAudience] = useState("General public");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!announcement.trim()) return;
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, announcement, audience, tone }),
    });
    const data = await res.json();
    setOutput(data.result || data.error);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-950 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-300 mb-2">AI Press Release</h1>
        <p className="text-slate-400 mb-8">Write newsworthy press releases that grab media attention</p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your Company"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                {["Professional","Urgent","Celebratory","Thought Leadership"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Target Audience</label>
              <input value={audience} onChange={e => setAudience(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Announcement *</label>
              <textarea value={announcement} onChange={e => setAnnouncement(e.target.value)} rows={5}
                placeholder="We are launching a new product that..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none" />
            </div>
            <button onClick={handleGenerate} disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-colors">
              {loading ? "Generating..." : "Write Press Release"}
            </button>
          </div>
          <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-emerald-300 mb-4">Press Release</h2>
            {output ? (
              <pre className="text-slate-200 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-[600px] overflow-y-auto">{output}</pre>
            ) : (
              <div className="text-slate-500 flex items-center justify-center h-64">Your press release will appear here...</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
