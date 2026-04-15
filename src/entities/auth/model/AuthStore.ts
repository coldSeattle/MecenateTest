import { makeAutoObservable, runInAction } from 'mobx';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { setTokenProvider } from '@shared/api';

const TOKEN_KEY = 'mecenate_auth_token';

export class AuthStore {
  token: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  async init() {
    try {
      let stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!stored) {
        stored = Crypto.randomUUID();
        await SecureStore.setItemAsync(TOKEN_KEY, stored);
      }
      runInAction(() => {
        this.token = stored;
        this.isReady = true;
      });
    } catch {
      runInAction(() => {
        this.token = Crypto.randomUUID();
        this.isReady = true;
      });
    }

    setTokenProvider(() => this.token);
  }
}
