export interface Player {
  id: string;
  name: string;
  country: string;
  position: 'singles' | 'doubles';
  ranking: number;
  stats: PlayerStats;
  price: number;
  image?: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  fantasyPoints: number;
  recentForm: number[];
}

export interface Match {
  id: string;
  tournament: string;
  players: Player[];
  date: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: string;
  round: string;
}

export interface FantasyTeam {
  id: string;
  name: string;
  players: Player[];
  budget: number;
  budgetUsed: number;
  totalPoints: number;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  teams: FantasyTeam[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  favoriteCountries: string[];
}

export interface League {
  id: string;
  name: string;
  type: 'public' | 'private';
  entryFee: number;
  prizePool: number;
  participants: User[];
  startDate: string;
  endDate: string;
}