export enum Position {
  TOP_CARRIER = "attacker",
  TOP_EXP = "speedster",
  JUNGLER = "all-rounder",
  BOTTOM_CARRIER = "defender",
  BOTTOM_EXP = "supporter",
}

export const POSITIONS = [
  { id: Position.TOP_CARRIER, name: "上キャリー" },
  { id: Position.TOP_EXP, name: "上学習" },
  { id: Position.JUNGLER, name: "中央エリア" },
  { id: Position.BOTTOM_CARRIER, name: "下キャリー" },
  { id: Position.BOTTOM_EXP, name: "下学習" },
];

export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
}

export const pokemonList: Pokemon[] = [
  {
    id: "venusaur",
    name: "フシギバナ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/1-venusaurjpg.png",
  },
  {
    id: "pikachu",
    name: "ピカチュウ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/4-pikachujpg.png",
  },
  {
    id: "raichu",
    name: "ライチュウ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17449022163fced3eb-9bcc-43c4-bbcd-b39c3700221f.png",
  },
  {
    id: "mew",
    name: "ミュウ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16622202994d7d8551-edeb-4a79-b74d-adf3a0b11625jpeg.png",
  },
  {
    id: "mewtwo-y",
    name: "ミュウツーY",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16889280954d27ba55-c1fc-4e9d-a197-89ca5ec6d60a.png",
  },
  {
    id: "espeon",
    name: "エーフィ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1652292059a2512edd-bdb2-4d52-98b2-c6718317556cjpeg.png",
  },
  {
    id: "gardevoir",
    name: "サーナイト",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/13-gardevoirjpg.png",
  },
  {
    id: "latios",
    name: "ラティオス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1752879096e11f4eab-2b2f-4c54-a914-c1b609177011.png",
  },
  {
    id: "chandelure",
    name: "シャンデラ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1682351130df5eea4e-340e-46ec-aa41-34995153e6a4.png",
  },
  {
    id: "greninja",
    name: "ゲッコウガ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/18-greninjajpg.png",
  },
  {
    id: "delphox",
    name: "マフォクシー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1654569202c397abc9-4cca-4d7b-8223-fa2e33aec3f3jpeg.png",
  },
  {
    id: "sylveon",
    name: "ニンフィア",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz163270917225-sylveonjpg.png",
  },
  {
    id: "glaceon",
    name: "グレイシア",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16579521651b315951-c615-4ba2-9ee9-9e3aab976e8cjpeg.png",
  },
  {
    id: "alolan-ninetales",
    name: "アローラキュウコン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/6-a-ninetailsjpg.png",
  },
  {
    id: "alolan-ninetales",
    name: "アローラキュウコン",
    imageUrl:
      "https://unite.pokemon.com/images/pokemon/alolan-ninetales/roster/roster-alolan-ninetales.png",
  },
  {
    id: "decidueye",
    name: "ジュナイパー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz163659161426-decidueyejpg.png",
  },
  {
    id: "cramorant",
    name: "ウッウ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/23-cramorantjpg.png",
  },
  {
    id: "cinderace",
    name: "エースバーン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/21-cinderacejpg.png",
  },
  {
    id: "interleon",
    name: "インテレオン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16888412192908b3a6-4470-4040-b9ef-9c736a71b177.png",
  },
  {
    id: "dragapult",
    name: "ドラパルト",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1669954509b1896d88-e0d1-4f48-b481-6c8053aab16djpeg.png",
  },
  {
    id: "duraludon",
    name: "ジュラルドン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1647299886de7cc94f-1d0b-4135-9aea-2a38bc0097dcjpeg.png",
  },
  {
    id: "armarouge",
    name: "グレンアルマ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-172547145815aae885-60cd-4974-affe-e89db03b5030.png",
  },
  {
    id: "miraidon",
    name: "ミライドン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-170900763541cf3275-b698-4875-b861-4083276779cb.png",
  },
  {
    id: "charizard",
    name: "リザードン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/2-charizardjpg.png",
  },
  {
    id: "machamp",
    name: "カイリキー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/9-machampjpg.png",
  },
  {
    id: "scyther",
    name: "ストライク",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-166222029951bb92ce-b7da-400d-aaa0-701a7eab3042jpeg.png",
  },
  {
    id: "gyarados",
    name: "ギャラドス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1704353959952b388c-601f-46f5-a245-a4e661771576.png",
  },
  {
    id: "dragonite",
    name: "カイリュー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1639084918906b0238-6560-4e9e-a99b-0839500ec009jpeg.png",
  },
  {
    id: "mewtwo-x",
    name: "ミュウツーX",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1688928082db5f4cdc-ed1c-41d5-aa9d-d1f9fd053206.png",
  },
  {
    id: "azumarill",
    name: "マリルリ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16491314467bfdd641-c479-461f-a37c-0585bd4ed4edjpeg.png",
  },
  {
    id: "scizor",
    name: "ハッサム",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1662220299b2df025a-31ad-44bc-a5f8-100edec919b8jpeg.png",
  },
  {
    id: "suicune",
    name: "スイクン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-174081274107e93379-667b-4975-8867-f5b731bc727e.png",
  },
  {
    id: "tyranitar",
    name: "バンギラス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16579522103c05be1a-eca4-4226-b2d6-44733fa4a379jpeg.png",
  },
  {
    id: "blaziken",
    name: "バシャーモ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16889281081f273547-be39-431d-9673-4a8461459f6b.png",
  },
  {
    id: "metagross",
    name: "メタグロス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-170321952002cd2d85-85a8-4ca8-823c-9d6e04f5dbf1.png",
  },
  {
    id: "garchomp",
    name: "ガブリアス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/15-garchompjpg.png",
  },
  {
    id: "lucario",
    name: "ルカリオ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/16-lucariojpg.png",
  },
  {
    id: "aegislash",
    name: "ギルガルド",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16439831442eaf58aa-c594-44e4-8826-a9f22b0918c7jpeg.png",
  },
  {
    id: "tsareena",
    name: "アマージョ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1639084918cdbf3e10-8738-4d23-ab43-45bf02a5113cjpeg.png",
  },
  {
    id: "mimikyu",
    name: "ミミッキュ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16927621132fa3488a-537b-41a8-9488-4b81622c0982.png",
  },
  {
    id: "buzzwole",
    name: "マッシブーン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16579521790de84814-a5d4-4770-913f-bfe47f82f00ajpeg.png",
  },
  {
    id: "falinks",
    name: "タイレーツ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17139123932b01f38f-f791-44d8-aa6b-a8e72fd6aad2.png",
  },
  {
    id: "zacian",
    name: "ザシアン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1677709852251415d3-beda-4058-9fed-c88029af7d30jpeg.png",
  },
  {
    id: "urshifu",
    name: "ウーラオス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16699545095b39b97b-2f90-4abb-983c-7f3804d6d60djpeg.png",
  },
  {
    id: "ceruleage",
    name: "ソウブレイズ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17191743516331a25e-0fb7-4e33-ad4d-59fe1353b0af.png",
  },
  {
    id: "tinkaton",
    name: "デカヌチャン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1733988078ac6375a6-7abc-49aa-bb32-41a1993fa9d7.png",
  },
  {
    id: "rapidash",
    name: "ギャロップ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-173765516420201f47-d7f8-4570-b250-583a6d05a9e1.png",
  },
  {
    id: "dodrio",
    name: "ドードリオ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16622202995c897e64-4e9b-474f-bf9e-300e99362751jpeg.png",
  },
  {
    id: "gengar",
    name: "ゲンガー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/10-gengarjpg.png",
  },
  {
    id: "absol",
    name: "アブソル",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/14-absoljpg.png",
  },
  {
    id: "leafeon",
    name: "リーフィア",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16858954057d1f3519-2cb7-49eb-ae7c-18c297c92216.png",
  },
  {
    id: "darkrai",
    name: "ダークライ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17291806971ec5c318-9ea5-4018-a53a-e9419309d553.png",
  },
  {
    id: "zoroark",
    name: "ゾロアーク",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1664205924fb12fb95-9528-4947-8731-422b35ea92c5jpeg.png",
  },
  {
    id: "talonflame",
    name: "ファイアロー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/19-talonflamejpg.png",
  },
  {
    id: "zeraora",
    name: "ゼラオラ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/20-zeraorajpg.png",
  },
  {
    id: "meowscarada",
    name: "マスカーニャ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17005342874502fb0b-bb4b-4f96-b046-9edbac4378f8.png",
  },
  {
    id: "blastoise",
    name: "カメックス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/3-blastoisejpg.png",
  },
  {
    id: "slowbro",
    name: "ヤドラン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/8-slowbrojpg.png",
  },
  {
    id: "lapras",
    name: "ラプラス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1675874193f32ca66b-2452-40d7-a833-9edc94a6d7bejpeg.png",
  },
  {
    id: "snorlax",
    name: "カビゴン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/12-snorlaxjpg.png",
  },
  {
    id: "umbreon",
    name: "ブラッキー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-168472845367e63f02-b9f6-453e-a529-97fcfea04e2f.png",
  },
  {
    id: "ho-oh",
    name: "ホウオウ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17219597935f0190a6-12c4-4b3a-8254-76552868fc9e.png",
  },
  {
    id: "mamoswine",
    name: "マンムー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz163270917224-mamoswinejpg.png",
  },
  {
    id: "crustle",
    name: "イワパレス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/17-crustlejpg.png",
  },
  {
    id: "goodra",
    name: "ヌメルゴン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16758741934fbd7db5-1841-409d-87aa-3f5ce9706f60jpeg.png",
  },
  {
    id: "trevenant",
    name: "オーロット",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16421130726ad4692a-63cd-410b-aff9-4e9ee1f1e782jpeg.png",
  },
  {
    id: "greedent",
    name: "ヨクバリス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz16348382178102a056-6d98-46d2-ac10-14542f201d04jpeg.png",
  },
  {
    id: "clefable",
    name: "ピクシー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1733988078e5fdc99a-3f80-44d6-9032-93c2914503a7.png",
  },
  {
    id: "wigglytuff",
    name: "プクリン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17339886831039e938-2655-4c44-92e6-d97423c72881.png",
  },
  {
    id: "wigglytuff",
    name: "プクリン",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-17339886831039e938-2655-4c44-92e6-d97423c72881.png",
  },
  {
    id: "psyduck",
    name: "コダック",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1731611667da469b03-06ba-4ee8-ad61-3f42f1cf577b.png",
  },
  {
    id: "mr-mime",
    name: "バリヤード",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/11-mr-mimejpg.png",
  },
  {
    id: "blissey",
    name: "ハピナス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1627719913bef19e02-4abc-43f8-8752-971ca9f421fbjpeg.png",
  },
  {
    id: "sableye",
    name: "ヤミラミ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1664205924a2f3acf6-f547-4975-b3e5-04da31a6b65ajpeg.png",
  },
  {
    id: "latias",
    name: "ラティアス",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-175287909687b82aa5-a2ef-487c-bd69-c2bf33a7e5bf.png",
  },
  {
    id: "hoopa",
    name: "フーパ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zz1645720398b04cb2ec-4dab-4e45-81f3-645957ebf595jpeg.png",
  },
  {
    id: "comfey",
    name: "キュワワー",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-16715230753a7e13c2-1c84-4175-8df9-555f01ea4382jpeg.png",
  },
  {
    id: "eldegoss",
    name: "ワタシラガ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/22-eldegossjpg.png",
  },
  {
    id: "alcremie",
    name: "マホイップ",
    imageUrl:
      "https://tiermaker.com/images/chart/chart/pokemon-unite-tier-list--452797/zzzzz-1749786263dcc2e8d8-4403-4e85-8244-61adee5b97bb.png",
  },
];
