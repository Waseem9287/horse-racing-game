export interface IHorseColor {
  colorName: string;
  colorCode: string;
}

export interface IHorse {
  name: string;
  color: IHorseColor;
  condition: number;
}

export interface IHorsesState {
  horses: IHorse[];
}

export enum ERoundDistance {
  ROUND1 = 1200, // e.g., 1200 meters
  ROUND2 = 1400, // e.g., 1400 meters
  ROUND3 = 1600, // e.g., 1600 meters
  ROUND4 = 1800, // e.g., 1800 meters
  ROUND5 = 2000, // e.g., 2000 meters
  ROUND6 = 2200, // e.g., 2200 meters
}

export const AROUND_DISTANCES = [
  ERoundDistance.ROUND1,
  ERoundDistance.ROUND2,
  ERoundDistance.ROUND3,
  ERoundDistance.ROUND4,
  ERoundDistance.ROUND5,
  ERoundDistance.ROUND6,
];

export interface IRound {
  id: string;

  distance: ERoundDistance;
  horses: Array<IHorse>; // Array of horse names participating
  places: Array<string>; // Array of horse names in the order they finished

  roundProgress: Record<string, number>; // Progress of each horse in the round, e.g., { "Horse1": 50, "Horse2": 75 }
}

export interface IRace {
  id: string;
  rounds: Array<IRound>;
}

export interface IRacesState {
  paused: boolean;
  currentRound: IRound | null;
  currentRace: IRace | null;
  previousRaces: Array<IRace>;
}

export interface IRootState {
  horses: IHorsesState;
  races: IRacesState;
}
