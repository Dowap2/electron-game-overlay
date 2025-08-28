export interface Unit {
  character_id: string;
  tier: number;
  items: number[];
}

export interface Player {
  summonerName: string;
  isLocalPlayer: boolean;
  units: Unit[];
}
