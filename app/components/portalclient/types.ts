export interface UserItem {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  elo_rating: number;
  trust_score: number;
  total_matches: number;
  wins: number;
  losses: number;
  is_provisional: boolean;
  created_at: string;
}

export interface CourtItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  qr_code_value: string;
}

export interface MatchHistoryItem {
  id: string;
  player_a_id: string;
  player_b_id: string;
  player_a_name: string;
  player_b_name: string;
  court_name: string;
  scores_data: string | null;
  status: string;
  created_at: string;
  elo_change_a: number | null;
  elo_change_b: number | null;
}

export function getEloTier(elo: number) {
  if (elo >= 1700) {
    return { name: 'Cao thủ', code: 'master', tagBg: '#F5F5F7', tagColor: '#1D1D1F', borderColor: '#1D1D1F' };
  }
  if (elo >= 1500) {
    return { name: 'Tiềm năng', code: 'contender', tagBg: '#F5F5F7', tagColor: '#0071E3', borderColor: '#B8DBFF' };
  }
  return { name: 'Khởi đầu', code: 'rookie', tagBg: '#F5F5F7', tagColor: '#86868B', borderColor: '#E5E5E7' };
}

export function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return '***';
  return phone.slice(0, 3) + '***' + phone.slice(-3);
}

export function calculateWinrate(wins: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((wins / total) * 100);
}
