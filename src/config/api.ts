export const API_CONFIG = {
  POKEMON_DATA_URL: 'https://s3.ap-northeast-1.amazonaws.com/juv-shun.website-hosting/pokemon_master_data/pokemons.json',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24時間（ミリ秒）
  REQUEST_TIMEOUT: 10000, // 10秒
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1秒
} as const;

export const STORAGE_KEYS = {
  POKEMON_DATA: 'pokemon_data',
  POKEMON_METADATA: 'pokemon_metadata',
} as const;