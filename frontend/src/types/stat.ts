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
  h: number | string;
  hr: number | string;
  bb: number | string;
  hbp: number | string;
  so: number | string;
  er: number | string; // 자책점
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

  // 백엔드 원본 비율 지표
  origAvg?: number;
  origObp?: number;
  origSlg?: number;
  origOps?: number;
  origBabip?: number;

  // 백엔드 산출 MLB 환산 비율
  mlbAvg?: number;
  mlbObp?: number;
  mlbSlg?: number;
  mlbOps?: number;
  mlbBabip?: number;
}

export interface PitcherStatResult {
  league: string;
  ip: string;
  h: number | null;
  hr: number;
  bb: number;
  hbp: number;
  so: number;
  er: number;

  // 백엔드 원본 이율 지표
  origEra?: number;
  origWhip?: number;
  origFip?: number;

  // 백엔드 산출 MLB 환산 비율
  mlbEra?: number;
  mlbWhip?: number;
  mlbFip?: number;
}
