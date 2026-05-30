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
  { id: "1", weapon: "AK-47", name: "Redline", wear: "FT", float: 0.2143, listingType: "sell", priceThb: 1240, priceUsd: 34, dealScore: 12, seller: { username: "BangkokTrader", rep: 4.9, location: "🇹🇭" } },
  { id: "2", weapon: "AWP", name: "Asiimov", wear: "FT", float: 0.3221, stattrak: true, listingType: "sell", priceThb: 4890, priceUsd: 138, dealScore: 8, seller: { username: "SaigonSniper", rep: 4.7, location: "🇻🇳" } },
  { id: "3", weapon: "M4A4", name: "Howl", wear: "MW", float: 0.0892, listingType: "trade", desiredItem: "Karambit | Doppler", desiredWear: "FN", seller: { username: "ManilaMint", rep: 5.0, location: "🇵🇭" }, notes: "Open to adding items depending on knife pattern." },
  { id: "4", weapon: "Karambit", name: "Fade", wear: "FN", float: 0.0067, listingType: "both", priceThb: 89000, priceUsd: 2510, desiredItem: "AWP | Dragon Lore", desiredWear: "FT", seller: { username: "ChiangMaiCollector", rep: 4.95, location: "🇹🇭" } },
  { id: "5", weapon: "Glock-18", name: "Fade", wear: "FN", float: 0.0014, listingType: "sell", priceThb: 12400, priceUsd: 350, dealScore: 15, seller: { username: "HanoiHunter", rep: 4.6, location: "🇻🇳" } },
  { id: "6", weapon: "Desert Eagle", name: "Blaze", wear: "FN", float: 0.0241, listingType: "sell", priceThb: 8900, priceUsd: 251, dealScore: 5, seller: { username: "PhuketPro", rep: 4.8, location: "🇹🇭" } },
  { id: "7", weapon: "USP-S", name: "Kill Confirmed", wear: "MW", float: 0.0987, stattrak: true, listingType: "sell", priceThb: 2890, priceUsd: 82, seller: { username: "JakartaJoker", rep: 4.5, location: "🇮🇩" } },
  { id: "8", weapon: "Sport Gloves", name: "Pandora's Box", wear: "FT", float: 0.2891, listingType: "both", priceThb: 64000, priceUsd: 1806, desiredItem: "Bayonet | Marble Fade", desiredWear: "FN", seller: { username: "KLKnifeKing", rep: 4.92, location: "🇲🇾" } },
  { id: "9", weapon: "M4A1-S", name: "Hyper Beast", wear: "FN", float: 0.0341, listingType: "sell", priceThb: 3450, priceUsd: 97, dealScore: 11, seller: { username: "BangkokTrader", rep: 4.9, location: "🇹🇭" } },
  { id: "10", weapon: "AK-47", name: "Vulcan", wear: "MW", float: 0.0871, listingType: "sell", priceThb: 6280, priceUsd: 177, dealScore: 7, seller: { username: "SingaSkins", rep: 4.85, location: "🇸🇬" } },
  { id: "11", weapon: "Butterfly Knife", name: "Tiger Tooth", wear: "FN", float: 0.0089, listingType: "both", priceThb: 78500, priceUsd: 2215, desiredItem: "M9 Bayonet | Doppler", seller: { username: "ChiangMaiCollector", rep: 4.95, location: "🇹🇭" } },
  { id: "12", weapon: "AWP", name: "Neo-Noir", wear: "FN", float: 0.0124, listingType: "sell", priceThb: 5640, priceUsd: 159, dealScore: 9, seller: { username: "SaigonSniper", rep: 4.7, location: "🇻🇳" } },
  { id: "13", weapon: "M9 Bayonet", name: "Marble Fade", wear: "FN", float: 0.0098, listingType: "trade", desiredItem: "Karambit | Lore", desiredWear: "FN", seller: { username: "BKKBlades", rep: 4.88, location: "🇹🇭" } },
  { id: "14", weapon: "Glock-18", name: "Water Elemental", wear: "MW", float: 0.0732, listingType: "sell", priceThb: 480, priceUsd: 14, dealScore: 18, seller: { username: "JakartaJoker", rep: 4.5, location: "🇮🇩" } },
  { id: "15", weapon: "Specialist Gloves", name: "Crimson Kimono", wear: "WW", float: 0.4012, listingType: "sell", priceThb: 42000, priceUsd: 1185, seller: { username: "KLKnifeKing", rep: 4.92, location: "🇲🇾" } },
  { id: "16", weapon: "USP-S", name: "Printstream", wear: "FN", float: 0.0421, listingType: "sell", priceThb: 11200, priceUsd: 316, dealScore: 6, seller: { username: "PhuketPro", rep: 4.8, location: "🇹🇭" } },
  { id: "17", weapon: "AK-47", name: "Asiimov", wear: "FT", float: 0.2841, stattrak: true, listingType: "both", priceThb: 8900, priceUsd: 251, desiredItem: "M4A1-S | Printstream", seller: { username: "HanoiHunter", rep: 4.6, location: "🇻🇳" } },
  { id: "18", weapon: "AWP", name: "Wildfire", wear: "MW", float: 0.0931, listingType: "sell", priceThb: 7200, priceUsd: 203, dealScore: 10, seller: { username: "ManilaMint", rep: 5.0, location: "🇵🇭" } },
  { id: "19", weapon: "Bayonet", name: "Lore", wear: "FT", float: 0.2143, listingType: "sell", priceThb: 38900, priceUsd: 1097, seller: { username: "BKKBlades", rep: 4.88, location: "🇹🇭" } },
  { id: "20", weapon: "Five-SeveN", name: "Hyper Beast", wear: "FN", float: 0.0312, listingType: "sell", priceThb: 980, priceUsd: 28, dealScore: 22, seller: { username: "SingaSkins", rep: 4.85, location: "🇸🇬" } },
  { id: "21", weapon: "M4A4", name: "The Emperor", wear: "MW", float: 0.0892, souvenir: true, listingType: "sell", priceThb: 14500, priceUsd: 409, dealScore: 4, seller: { username: "BangkokTrader", rep: 4.9, location: "🇹🇭" } },
  { id: "22", weapon: "Karambit", name: "Doppler", wear: "FN", float: 0.0098, listingType: "sell", priceThb: 95400, priceUsd: 2691, seller: { username: "ChiangMaiCollector", rep: 4.95, location: "🇹🇭" } },
  { id: "23", weapon: "P250", name: "See Ya Later", wear: "FN", float: 0.0231, listingType: "sell", priceThb: 1840, priceUsd: 52, dealScore: 13, seller: { username: "JakartaJoker", rep: 4.5, location: "🇮🇩" } },
  { id: "24", weapon: "AK-47", name: "Fire Serpent", wear: "FT", float: 0.2456, listingType: "trade", desiredItem: "AWP | Asiimov + cash", seller: { username: "SaigonSniper", rep: 4.7, location: "🇻🇳" } },
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
  { id: "p1", username: "BangkokTrader", location: "🇹🇭", type: "WTS", content: "Selling AK-47 | Redline FT, low float 0.21. ฿1,240. DM if interested.", timestamp: "12m ago", likes: 14, comments: 3 },
  { id: "p2", username: "SaigonSniper", location: "🇻🇳", type: "Discussion", content: "Anyone else seeing Asiimov prices drop this week? Good time to buy in.", timestamp: "1h ago", likes: 32, comments: 11 },
  { id: "p3", username: "ManilaMint", location: "🇵🇭", type: "WTB", content: "Looking for a Karambit | Doppler Phase 2. Have M4A4 | Howl MW to trade.", timestamp: "3h ago", likes: 8, comments: 5 },
  { id: "p4", username: "ChiangMaiCollector", location: "🇹🇭", type: "Trade", content: "Karambit | Fade FN 0.006 looking for AWP | Dragon Lore + balance. Serious offers only.", timestamp: "4h ago", likes: 47, comments: 19 },
  { id: "p5", username: "SingaSkins", location: "🇸🇬", type: "Discussion", content: "Major Stockholm sticker capsules are heating up — anyone hoarding Vitality Holos?", timestamp: "6h ago", likes: 21, comments: 8 },
  { id: "p6", username: "KLKnifeKing", location: "🇲🇾", type: "WTS", content: "Sport Gloves | Pandora's Box FT — clean wear, great pattern. Open to crypto.", timestamp: "8h ago", likes: 12, comments: 4 },
  { id: "p7", username: "PhuketPro", location: "🇹🇭", type: "WTB", content: "Buying USP-S | Printstream FN under market. Cash ready, fast trade.", timestamp: "10h ago", likes: 6, comments: 2 },
  { id: "p8", username: "JakartaJoker", location: "🇮🇩", type: "Discussion", content: "What's your go-to AWP skin under ฿2,000? Building a budget setup.", timestamp: "12h ago", likes: 28, comments: 22 },
  { id: "p9", username: "HanoiHunter", location: "🇻🇳", type: "Trade", content: "AK-47 | Asiimov ST FT for M4A1-S | Printstream. Will add stickers/items if needed.", timestamp: "1d ago", likes: 15, comments: 6 },
  { id: "p10", username: "BKKBlades", location: "🇹🇭", type: "WTS", content: "M9 Bayonet | Marble Fade FAT (fire and ice) — looking for FN knife trades only.", timestamp: "1d ago", likes: 39, comments: 14 },
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
  { id: "m1", teamA: "NAVI", teamB: "FaZe", tournament: "BLAST Premier", tier: "S", time: "Today 22:00", status: "live", scoreA: 1, scoreB: 0 },
  { id: "m2", teamA: "Vitality", teamB: "G2", tournament: "IEM Katowice", tier: "S", time: "Tomorrow 19:30", status: "upcoming" },
  { id: "m3", teamA: "MOUZ", teamB: "Spirit", tournament: "ESL Pro League", tier: "A", time: "Tomorrow 23:00", status: "upcoming" },
  { id: "m4", teamA: "Cloud9", teamB: "Liquid", tournament: "BLAST Premier", tier: "S", time: "Fri 21:00", status: "upcoming" },
  { id: "m5", teamA: "Heroic", teamB: "Astralis", tournament: "BLAST Premier", tier: "A", time: "Today 18:00", status: "live", scoreA: 0, scoreB: 1 },
  { id: "m6", teamA: "Complexity", teamB: "FURIA", tournament: "ESL Pro League", tier: "A", time: "Sat 02:00", status: "upcoming" },
  { id: "m7", teamA: "Eternal Fire", teamB: "ENCE", tournament: "IEM Katowice", tier: "A", time: "Sat 19:00", status: "upcoming" },
  { id: "m8", teamA: "paiN", teamB: "Imperial", tournament: "BLAST Premier", tier: "B", time: "Sun 04:00", status: "upcoming" },
  { id: "m9", teamA: "NAVI", teamB: "G2", tournament: "ESL Pro League", tier: "S", time: "Yesterday 21:00", status: "done", scoreA: 2, scoreB: 1 },
  { id: "m10", teamA: "Vitality", teamB: "MOUZ", tournament: "BLAST Premier", tier: "S", time: "2d ago 20:00", status: "done", scoreA: 2, scoreB: 0 },
];

export function formatThb(n: number) {
  return "฿ " + n.toLocaleString("en-US");
}
