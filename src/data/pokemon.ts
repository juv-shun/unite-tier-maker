export enum Position {
  ATTACKER = 'attacker',
  SPEEDSTER = 'speedster',
  ALL_ROUNDER = 'all-rounder',
  DEFENDER = 'defender',
  SUPPORTER = 'supporter'
}

export const POSITIONS = [
  { id: Position.ATTACKER, name: '上キャリー' },
  { id: Position.SPEEDSTER, name: '上学習' },
  { id: Position.ALL_ROUNDER, name: '中央エリア' },
  { id: Position.DEFENDER, name: '下キャリー' },
  { id: Position.SUPPORTER, name: '下学習' }
];

export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
  position: Position;
}

export const pokemonList: Pokemon[] = [
  {
    id: "pikachu",
    name: "ピカチュウ",
    imageUrl: "https://unite.pokemon.com/images/pokemon/pikachu/roster/roster-pikachu.png",
    position: Position.ATTACKER
  },
  {
    id: "charizard",
    name: "リザードン",
    imageUrl: "https://unite.pokemon.com/images/pokemon/charizard/roster/roster-charizard.png",
    position: Position.ALL_ROUNDER
  },
  {
    id: "lucario",
    name: "ルカリオ",
    imageUrl: "https://unite.pokemon.com/images/pokemon/lucario/roster/roster-lucario.png",
    position: Position.ALL_ROUNDER
  },
  {
    id: "snorlax",
    name: "カビゴン",
    imageUrl: "https://unite.pokemon.com/images/pokemon/snorlax/roster/roster-snorlax.png",
    position: Position.DEFENDER
  },
  {
    id: "greninja",
    name: "ゲッコウガ",
    imageUrl: "https://unite.pokemon.com/images/pokemon/greninja/roster/roster-greninja.png",
    position: Position.ATTACKER
  },
  {
    id: "eldegoss",
    name: "ワタシラガ",
    imageUrl: "https://unite.pokemon.com/images/pokemon/eldegoss/roster/roster-eldegoss.png",
    position: Position.SUPPORTER
  },
  {
    id: "talonflame",
    name: "ファイアロー",
    imageUrl: "https://unite.pokemon.com/images/pokemon/talonflame/roster/roster-talonflame.png",
    position: Position.SPEEDSTER
  },
  {
    id: "slowbro",
    name: "ヤドラン",
    imageUrl: "https://unite.pokemon.com/images/pokemon/slowbro/roster/roster-slowbro.png",
    position: Position.DEFENDER
  },
  {
    id: "absol",
    name: "アブソル",
    imageUrl: "https://unite.pokemon.com/images/pokemon/absol/roster/roster-absol.png",
    position: Position.SPEEDSTER
  },
  {
    id: "machamp",
    name: "カイリキー",
    imageUrl: "https://unite.pokemon.com/images/pokemon/machamp/roster/roster-machamp.png",
    position: Position.ALL_ROUNDER
  },
  {
    id: "mr-mime",
    name: "バリヤード",
    imageUrl: "https://unite.pokemon.com/images/pokemon/mr-mime/roster/roster-mr-mime.png",
    position: Position.SUPPORTER
  },
  {
    id: "venusaur",
    name: "フシギバナ",
    imageUrl: "https://unite.pokemon.com/images/pokemon/venusaur/roster/roster-venusaur.png",
    position: Position.ATTACKER
  },
  {
    id: "cramorant",
    name: "ウッウ",
    imageUrl: "https://unite.pokemon.com/images/pokemon/cramorant/roster/roster-cramorant.png",
    position: Position.ATTACKER
  },
  {
    id: "gengar",
    name: "ゲンガー",
    imageUrl: "https://unite.pokemon.com/images/pokemon/gengar/roster/roster-gengar.png",
    position: Position.SPEEDSTER
  },
  {
    id: "garchomp",
    name: "ガブリアス",
    imageUrl: "https://unite.pokemon.com/images/pokemon/garchomp/roster/roster-garchomp.png",
    position: Position.ALL_ROUNDER
  },
  {
    id: "crustle",
    name: "イワパレス",
    imageUrl: "https://unite.pokemon.com/images/pokemon/crustle/roster/roster-crustle.png",
    position: Position.DEFENDER
  },
  {
    id: "cinderace",
    name: "エースバーン",
    imageUrl: "https://unite.pokemon.com/images/pokemon/cinderace/roster/roster-cinderace.png",
    position: Position.ATTACKER
  },
  {
    id: "alolan-ninetales",
    name: "アローラキュウコン",
    imageUrl: "https://unite.pokemon.com/images/pokemon/alolan-ninetales/roster/roster-alolan-ninetales.png",
    position: Position.ATTACKER
  },
  {
    id: "wigglytuff",
    name: "プクリン",
    imageUrl: "https://unite.pokemon.com/images/pokemon/wigglytuff/roster/roster-wigglytuff.png",
    position: Position.SUPPORTER
  },
  {
    id: "blastoise",
    name: "カメックス",
    imageUrl: "https://unite.pokemon.com/images/pokemon/blastoise/roster/roster-blastoise.png",
    position: Position.DEFENDER
  }
];
