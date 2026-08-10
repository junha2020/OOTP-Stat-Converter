import React, { useState } from "react";
import {
  type BatterStatInput,
  type BatterStatResult,
  type LeagueType,
  type PitcherStatInput,
  type PitcherStatResult,
} from "./types/stat";
import axios from "axios";

// 백엔드 API 주소
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://ootp-stat-converter.onrender.com";

type ModeType = "batter" | "pitcher";

export default function App() {
  const [mode, setMode] = useState<ModeType>("batter"); // batter | pitcher
  const [league, setLeague] = useState<LeagueType>("KBO");

  // Batter state
  const [batterInput, setBatterInput] = useState<BatterStatInput>({
    ab: 450,
    h: 135,
    doubleBase: 25,
    tripleBase: 2,
    hr: 20,
    bb: 50,
    hbp: 5,
    so: 90,
    sb: 15,
  });

  // Pitcher state
  const [pitcherInput, setPitcherInput] = useState<PitcherStatInput>({
    ip: "150.1",
    h: 130,
    hr: 15,
    bb: 45,
    hbp: 6,
    so: 140,
    er: 55,
  });

  const [batterResult, setBatterResult] = useState<BatterStatResult | null>(
    null,
  );
  const [pitcherResult, setPitcherResult] = useState<PitcherStatResult | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleBatterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBatterInput((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handlePitcherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPitcherInput((prev) => ({
      ...prev,
      [name]: name === "ip" ? value : value === "" ? "" : Number(value),
    }));
  };

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLeague(e.target.value as LeagueType);
  };

  const handleConvert = async () => {
    setErrorMessage("");
    setBatterResult(null);
    setPitcherResult(null);

    if (mode === "batter") {
      if (!batterInput.ab || Number(batterInput.ab) <= 0) {
        setErrorMessage("AB(타수)는 0보다 큰 수여야 합니다!");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "batter") {
        const response = await axios.post<BatterStatResult>(
          `${API_BASE_URL}/api/convert/batter`,
          { ...batterInput, league },
        );
        setBatterResult(response.data);
      } else {
        const response = await axios.post<PitcherStatResult>(
          `${API_BASE_URL}/api/convert/pitcher`,
          { ...pitcherInput, league },
        );
        setPitcherResult(response.data);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.message ||
            "스탯 변환 API 요청 실패! 백엔드 서버 확인바람.",
        );
      } else {
        setErrorMessage("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-8 border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            ⚾ OOTP Stat Converter
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sabermetric League Equivalency (MLE) - React + TS + Tailwind v4
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-medium">
            TypeScript v1.0
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* League & Mode Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-700/50">
            <button
              onClick={() => {
                setMode("batter");
                setBatterResult(null);
                setPitcherResult(null);
              }}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === "batter" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"}`}
            >
              타자 (Batter)
            </button>
            <button
              onClick={() => {
                setMode("pitcher");
                setBatterResult(null);
                setPitcherResult(null);
              }}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === "pitcher" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"}`}
            >
              투수 (Pitcher)
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-semibold text-slate-300 whitespace-nowrap">
              원래 리그 (League):
            </label>
            <select
              value={league}
              onChange={handleLeagueChange}
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="KBO">KBO League (한국)</option>
              <option value="NPB">NPB (일본)</option>
              <option value="AAA">Minor League (AAA)</option>
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-5 py-3 rounded-xl text-sm flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="text-rose-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Form Gird */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-xl backdrop-blue-sm">
          <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {league} {mode === "batter" ? "타자" : "투수"} 성적 입력
          </h2>

          {mode === "batter" ? (
            <div className="grid gird-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {(
                [
                  { label: "AB (타수)", name: "ab" },
                  { label: "H (안타)", name: "h" },
                  { label: "2B (2루타)", name: "doubleBase" },
                  { label: "3B (3루타)", name: "tripleBase" },
                  { label: "HR (홈런)", name: "hr" },
                  { label: "BB (볼넷)", name: "bb" },
                  { label: "HBP (사구)", name: "hbp" },
                  { label: "SO (삼진)", name: "so" },
                  { label: "SB (도루)", name: "sb" },
                ] as const
              ).map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={
                      batterInput[
                        field.name as keyof Omit<BatterStatInput, "league">
                      ]
                    }
                    onChange={handleBatterChange}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gird-cols-2 sm:grid-cols-3 md-grid-cols-7 gap-4">
              {(
                [
                  { label: "IP (이닝)", name: "ip", type: "text" },
                  { label: "H (피안타)", name: "h", type: "number" },
                  { label: "HR (피홈런)", name: "hr", type: "number" },
                  { label: "BB (볼넷)", name: "bb", type: "number" },
                  { label: "HBP (사구)", name: "hbp", type: "number" },
                  { label: "SO (탈삼진)", name: "so", type: "number" },
                  { label: "ER (자책점)", name: "er", type: "number" },
                ] as const
              ).map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      pitcherInput[
                        field.name as keyof Omit<PitcherStatInput, "league">
                      ]
                    }
                    onChange={handlePitcherChange}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "변환 중..." : "변환하기"}
          </button>
        </div>

        {/* Side-by-Side Comparison Result Card */}
        {(batterResult || pitcherResult) && (
          <div className="bg-slate-800 border border-emerald-500/50 p-6 rounded-2xl shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center justify-between">
              <span>MLB 환산 결과 비교</span>
              <span className="text-xs text-slate-400 font-normal">
                Symmetric Sabermetrics View
              </span>
            </h2>

            <div className="grid gird-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Original */}
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Original ({league})
                </h3>
                <div className="gird gird-cols-3 gap-3 font-mono text-sm">
                  {mode === "batter" ? (
                    <>
                      <div>
                        <span className="text-slate-500">AB:</span>{" "}
                        {batterInput.ab}
                      </div>
                      <div>
                        <span className="text-slate-500">H:</span>{" "}
                        {batterInput.h}
                      </div>
                      <div>
                        <span className="text-slate-500">2B:</span>{" "}
                        {batterInput.doubleBase}
                      </div>
                      <div>
                        <span className="text-slate-500">3B:</span>{" "}
                        {batterInput.tripleBase}
                      </div>
                      <div>
                        <span className="text-slate-500">HR:</span>{" "}
                        {batterInput.hr}
                      </div>
                      <div>
                        <span className="text-slate-500">BB:</span>{" "}
                        {batterInput.bb}
                      </div>
                      <div>
                        <span className="text-slate-500">HBP:</span>{" "}
                        {batterInput.hbp}
                      </div>
                      <div>
                        <span className="text-slate-500">SO:</span>{" "}
                        {batterInput.so}
                      </div>
                      <div>
                        <span className="text-slate-500">SB:</span>{" "}
                        {batterInput.sb}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-slate-500">IP:</span>{" "}
                        {pitcherInput.ip}
                      </div>
                      <div>
                        <span className="text-slate-500">H:</span>{" "}
                        {pitcherInput.h}
                      </div>
                      <div>
                        <span className="text-slate-500">HR:</span>{" "}
                        {pitcherInput.hr}
                      </div>
                      <div>
                        <span className="text-slate-500">BB:</span>{" "}
                        {pitcherInput.bb}
                      </div>
                      <div>
                        <span className="text-slate-500">HBP:</span>{" "}
                        {pitcherInput.hbp}
                      </div>
                      <div>
                        <span className="text-slate-500">SO:</span>{" "}
                        {pitcherInput.so}
                      </div>
                      <div>
                        <span className="text-slate-500">ER:</span>{" "}
                        {pitcherInput.er}
                      </div>
                    </>
                  )}
                </div>

                {/* 원본 비율 지표 */}
                {mode === "batter" && batterResult ? (
                  <div className="pt-3 border-t border-slate-800 gird gird-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div>
                      AVG:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.origAvg || 0) * 1000)}
                      </span>
                    </div>
                    <div>
                      OBP:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.origObp || 0) * 1000)}
                      </span>
                    </div>
                    <div>
                      SLG:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.origSlg || 0) * 1000)}
                      </span>
                    </div>
                    <div>
                      OPS:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.origOps || 0) * 1000)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      BABIP:{" "}
                      <span className="text-cyan-400 font-bold">
                        .{Math.round((batterResult.origBabip || 0) * 1000)}
                      </span>
                    </div>
                  </div>
                ) : pitcherResult ? (
                  <div className="pt-3 border-t border-slate-800 gird gird-cols-3 gap-2 text-xs font-mono text-slate-300">
                    <div>
                      ERA:{" "}
                      <span className="text-emerald-400 font-bold">
                        {pitcherResult.origEra?.toFixed(2) ?? "N/A"}
                      </span>
                    </div>
                    <div>
                      WHIP:{" "}
                      <span className="text-emerald-400 font-bold">
                        {pitcherResult.origWhip?.toFixed(2) ?? "N/A"}
                      </span>
                    </div>
                    <div>
                      FIP:{" "}
                      <span className="text-emerald-400 font-bold">
                        {pitcherResult.origFip?.toFixed(2) ?? "N/A"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right: Converted MLB */}
              <div className="bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/30 space-y-4">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                  Converted (MLB)
                </h3>
                <div className="grid grid-cols-3 gap-2 font-mono text-sm text-emerald-200">
                  {mode === "batter" && batterResult ? (
                    <>
                      <div>
                        <span className="text-slate-500">AB:</span>{" "}
                        {batterResult.ab}
                      </div>
                      <div>
                        <span className="text-slate-500">H:</span>{" "}
                        {batterResult.h}
                      </div>
                      <div>
                        <span className="text-slate-500">2B:</span>{" "}
                        {batterResult.doubleBase}
                      </div>
                      <div>
                        <span className="text-slate-500">3B:</span>{" "}
                        {batterResult.tripleBase}
                      </div>
                      <div>
                        <span className="text-slate-500">HR:</span>{" "}
                        {batterResult.hr}
                      </div>
                      <div>
                        <span className="text-slate-500">BB:</span>{" "}
                        {batterResult.bb}
                      </div>
                      <div>
                        <span className="text-slate-500">HBP:</span>{" "}
                        {batterResult.hbp}
                      </div>
                      <div>
                        <span className="text-slate-500">SO:</span>{" "}
                        {batterResult.so}
                      </div>
                      <div>
                        <span className="text-slate-500">SB:</span>{" "}
                        {batterResult.sb}
                      </div>
                    </>
                  ) : pitcherResult ? (
                    <>
                      <div>
                        <span className="text-slate-500">IP:</span>{" "}
                        {pitcherResult.ip}
                      </div>
                      <div>
                        <span className="text-slate-500">H:</span>{" "}
                        {pitcherResult.h}
                      </div>
                      <div>
                        <span className="text-slate-500">HR:</span>{" "}
                        {pitcherResult.hr}
                      </div>
                      <div>
                        <span className="text-slate-500">BB:</span>{" "}
                        {pitcherResult.bb}
                      </div>
                      <div>
                        <span className="text-slate-500">HBP:</span>{" "}
                        {pitcherResult.hbp}
                      </div>
                      <div>
                        <span className="text-slate-500">SO:</span>{" "}
                        {pitcherResult.so}
                      </div>
                      <div>
                        <span className="text-slate-500">ER:</span>{" "}
                        {pitcherResult.er}
                      </div>
                    </>
                  ) : null}
                </div>

                {/* 비율 지표 전용 박스 */}
                {mode === "batter" && batterResult ? (
                  <div className="pt-3 border-t border-emerald-900/60 gird gird-cols-2 gap-2 text-xs font-mono text-emerald-300">
                    <div>
                      AVG:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.mlbAvg || 0) * 1000)}
                      </span>
                    </div>
                    <div>
                      OBP:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.mlbObp || 0) * 1000)}
                      </span>
                    </div>
                    <div>
                      SLG:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.mlbSlg || 0) * 1000)}
                      </span>
                    </div>
                    <div>
                      OPS:{" "}
                      <span className="text-emerald-400 font-bold">
                        .{Math.round((batterResult.mlbOps || 0) * 1000)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      BABIP:{" "}
                      <span className="text-cyan-400 font-bold">
                        .{Math.round((batterResult.mlbBabip || 0) * 1000)}
                      </span>
                    </div>
                  </div>
                ) : pitcherResult ? (
                  <div className="pt-3 border-t border-emerald-900/60 grid gird-cols-3 gap-2 text-xs font-mono text-emerald-300">
                    <div>
                      ERA:{" "}
                      <span className="text-emerald-400 font-bold">
                        {pitcherResult.mlbEra?.toFixed(2) ?? "N/A"}
                      </span>
                    </div>
                    <div>
                      WHIP:{" "}
                      <span className="text-emerald-400 font-bold">
                        {pitcherResult.mlbWhip?.toFixed(2) ?? "N/A"}
                      </span>
                    </div>
                    <div>
                      FIP:{" "}
                      <span className="text-emerald-400 font-bold">
                        {pitcherResult.mlbFip?.toFixed(2) ?? "N/A"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
