export type LeagueType = "KBO" | "NPB" | "AAA";

export interface BatterStatInput {
  league?: LeagueType;
  ab: number | string;
  h: number | string;
  doubleBase: number | string;
  tripleBase: number | string;
  hr: number | string;
  bb: number | string;
  hbp: number | string;
  so: number | string;
  sb: number | string;
}

export interface PitcherStatInput {
  league?: LeagueType;
  ip: string;
  h: number | "";
  hr: number | "";
  bb: number | "";
  hbp: number | "";
  so: number | "";
}

export interface BatterStatResult {
  league: string;
  ab: number;
  h: number;
  doubleBase: number;
  tripleBase: number;
  hr: number;
  bb: number;
  hbp: number;
  so: number;
  sb: number;
  avg?: number;
}

export interface PitcherStatResult {
  league: string;
  ip: string;
  h: number | null;
  hr: number;
  bb: number;
  hbp: number;
  so: number;
}
