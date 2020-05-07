interface IStat {
  name: string;
  value: number;
  display_value: string;
  stat_id: number;
  roll?: number;
}

export interface IMod {
  id: string;
  character: string;
  rarity: number;
  slot: number;
  tier: number;
  level: number;
  set: number;
  secondary_stats: IStat[];
  primary_stat: IStat
}
