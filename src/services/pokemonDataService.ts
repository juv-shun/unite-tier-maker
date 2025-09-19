import { Pokemon, ApiResponse, CacheMetadata } from '../types';
import { API_CONFIG, STORAGE_KEYS } from '../config/api';

class PokemonDataService {
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries: number = API_CONFIG.RETRY_ATTEMPTS): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.sleep(API_CONFIG.RETRY_DELAY * (i + 1));
      }
    }
    throw new Error('All retry attempts failed');
  }

  private getCachedMetadata(): CacheMetadata | null {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.POKEMON_METADATA);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private setCachedMetadata(metadata: CacheMetadata): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POKEMON_METADATA, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to save metadata to localStorage:', error);
    }
  }

  private getCachedData(): Pokemon[] | null {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.POKEMON_DATA);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private setCachedData(data: Pokemon[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POKEMON_DATA, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    }
  }

  private isCacheValid(metadata: CacheMetadata): boolean {
    const now = Date.now();
    return (now - metadata.timestamp) < API_CONFIG.CACHE_DURATION;
  }

  async fetchPokemonData(): Promise<ApiResponse<Pokemon[]>> {
    const cachedMetadata = this.getCachedMetadata();
    const headers: Record<string, string> = {};

    // キャッシュが有効で、ETAGが存在する場合は条件付きリクエストを送信
    if (cachedMetadata && this.isCacheValid(cachedMetadata)) {
      if (cachedMetadata.etag) {
        headers['If-None-Match'] = cachedMetadata.etag;
      }
      if (cachedMetadata.lastModified) {
        headers['If-Modified-Since'] = cachedMetadata.lastModified;
      }
    }

    try {
      const response = await this.fetchWithRetry(API_CONFIG.POKEMON_DATA_URL, {
        method: 'GET',
        headers,
      });

      // 304 Not Modified - キャッシュされたデータを返す
      if (response.status === 304) {
        const cachedData = this.getCachedData();
        if (cachedData) {
          return {
            data: cachedData,
            etag: cachedMetadata?.etag,
            lastModified: cachedMetadata?.lastModified,
          };
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Pokemon[] = await response.json();
      const etag = response.headers.get('etag') || undefined;
      const lastModified = response.headers.get('last-modified') || undefined;

      // 新しいデータとメタデータをキャッシュ
      this.setCachedData(data);
      this.setCachedMetadata({
        etag,
        lastModified,
        timestamp: Date.now(),
      });

      return {
        data,
        etag,
        lastModified,
      };
    } catch (error) {
      // フォールバックなし - エラーをそのまま投げる
      throw error;
    }
  }

  clearCache(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.POKEMON_DATA);
      localStorage.removeItem(STORAGE_KEYS.POKEMON_METADATA);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

export const pokemonDataService = new PokemonDataService();