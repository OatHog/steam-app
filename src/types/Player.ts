export interface Player {
  steamid: string;
  personaname: string;
  avatarfull: string;
  personastate: number;
  gameextrainfo: boolean;
  profileurl: string;
}

export interface PlayerSummary {
  getSteamId: string;
  getPersonName: string;
  getAvatar: string;
  getStatus: number;
  getGames?: string | boolean;
  getProfileUrl: string;
}
