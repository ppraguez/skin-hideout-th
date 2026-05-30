export type Wear = "FN" | "MW" | "FT" | "WW" | "BS";
export type ListingType = "sell" | "trade" | "both";

export const WEAR_LABEL: Record<Wear, string> = {
  FN: "Factory New",
  MW: "Minimal Wear",
  FT: "Field-Tested",
  WW: "Well-Worn",
  BS: "Battle-Scarred",
};

export const WEAR_COLOR: Record<Wear, string> = {
  FN: "text-primary border-primary/40",
  MW: "text-success border-success/40",
  FT: "text-amber border-amber/40",
  WW: "text-orange-400 border-orange-400/40",
  BS: "text-destructive border-destructive/40",
};

export interface Skin {
  id: string;
  weapon: string;
  name: string;
  wear: Wear;
  float: number;
  stattrak?: boolean;
  souvenir?: boolean;
  listingType: ListingType;
  priceThb?: number;
  priceUsd?: number;
  desiredItem?: string;
  desiredWear?: Wear;
  dealScore?: number; // % below market
  seller: { username: string; rep: number; location: string };
  notes?: string;
}

export const SKINS: Skin[] = [
  {
    id: "1",
    weapon: "AK-47",
    name: "Redline",
    wear: "FT",
    float: 0.2143,
    listingType: "sell",
    priceThb: 1240,
    priceUsd: 34,
    dealScore: 12,
    seller: { username: "BangkokTrader", rep: 4.9, location: "🇹🇭" },
  },
  {
    id: "2",
    weapon: "AWP",
    name: "Asiimov",
    wear: "FT",
    float: 0.3221,
    stattrak: true,
    listingType: "sell",
    priceThb: 4890,
    priceUsd: 138,
    dealScore: 8,
    seller: { username: "SaigonSniper", rep: 4.7, location: "🇻🇳" },
  },
  {
    id: "3",
    weapon: "M4A4",
    name: "Howl",
    wear: "MW",
    float: 0.0892,
    listingType: "trade",
    desiredItem: "Karambit | Doppler",
    desiredWear: "FN",
    seller: { username: "ManilaMint", rep: 5.0, location: "🇵🇭" },
    notes: "Open to adding items depending on knife pattern.",
  },
  {
    id: "4",
    weapon: "Karambit",
    name: "Fade",
    wear: "FN",
    float: 0.0067,
    listingType: "both",
    priceThb: 89000,
    priceUsd: 2510,
    desiredItem: "AWP | Dragon Lore",
    desiredWear: "FT",
    seller: { username: "ChiangMaiCollector", rep: 4.95, location: "🇹🇭" },
  },
  {
    id: "5",
    weapon: "Glock-18",
    name: "Fade",
    wear: "FN",
    float: 0.0014,
    listingType: "sell",
    priceThb: 12400,
    priceUsd: 350,
    dealScore: 15,
    seller: { username: "HanoiHunter", rep: 4.6, location: "🇻🇳" },
  },
  {
    id: "6",
    weapon: "Desert Eagle",
    name: "Blaze",
    wear: "FN",
    float: 0.0241,
    listingType: "sell",
    priceThb: 8900,
    priceUsd: 251,
    dealScore: 5,
    seller: { username: "PhuketPro", rep: 4.8, location: "🇹🇭" },
  },
  {
    id: "7",
    weapon: "USP-S",
    name: "Kill Confirmed",
    wear: "MW",
    float: 0.0987,
    stattrak: true,
    listingType: "sell",
    priceThb: 2890,
    priceUsd: 82,
    seller: { username: "JakartaJoker", rep: 4.5, location: "🇮🇩" },
  },
  {
    id: "8",
    weapon: "Sport Gloves",
    name: "Pandora's Box",
    wear: "FT",
    float: 0.2891,
    listingType: "both",
    priceThb: 64000,
    priceUsd: 1806,
    desiredItem: "Bayonet | Marble Fade",
    desiredWear: "FN",
    seller: { username: "KLKnifeKing", rep: 4.92, location: "🇲🇾" },
  },
];

export interface CommunityPost {
  id: string;
  username: string;
  location: string;
  type: "WTB" | "WTS" | "Discussion" | "Trade";
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export const POSTS: CommunityPost[] = [
  {
    id: "p1",
    username: "BangkokTrader",
    location: "🇹🇭",
    type: "WTS",
    content: "Selling AK-47 | Redline FT, low float 0.21. ฿1,240. DM if interested.",
    timestamp: "12m ago",
    likes: 14,
    comments: 3,
  },
  {
    id: "p2",
    username: "SaigonSniper",
    location: "🇻🇳",
    type: "Discussion",
    content: "Anyone else seeing Asiimov prices drop this week? Good time to buy in.",
    timestamp: "1h ago",
    likes: 32,
    comments: 11,
  },
  {
    id: "p3",
    username: "ManilaMint",
    location: "🇵🇭",
    type: "WTB",
    content: "Looking for a Karambit | Doppler Phase 2. Have M4A4 | Howl MW to trade.",
    timestamp: "3h ago",
    likes: 8,
    comments: 5,
  },
];

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  tournament: string;
  tier: "S" | "A" | "B";
  time: string;
  status: "live" | "upcoming" | "done";
  scoreA?: number;
  scoreB?: number;
}

export const MATCHES: Match[] = [
  { id: "m1", teamA: "NAVI", teamB: "FaZe", tournament: "BLAST Premier", tier: "S", time: "วันนี้ 22:00", status: "live", scoreA: 1, scoreB: 0 },
  { id: "m2", teamA: "Vitality", teamB: "G2", tournament: "IEM Katowice", tier: "S", time: "พรุ่งนี้ 19:30", status: "upcoming" },
  { id: "m3", teamA: "MOUZ", teamB: "Spirit", tournament: "ESL Pro League", tier: "A", time: "พรุ่งนี้ 23:00", status: "upcoming" },
  { id: "m4", teamA: "Cloud9", teamB: "Liquid", tournament: "BLAST Premier", tier: "S", time: "ศุกร์ 21:00", status: "upcoming" },
];

export function formatThb(n: number) {
  return "฿ " + n.toLocaleString("en-US");
}
