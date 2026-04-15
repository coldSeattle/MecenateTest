import React from 'react';
import { AuthStore } from '@entities/auth';
import { FeedStore } from '@features/like-post/model/FeedStore';

export class RootStore {
  auth = new AuthStore();
  feed = new FeedStore();
}

export const rootStore = new RootStore();

const StoreContext = React.createContext<RootStore>(rootStore);

export const StoreProvider = StoreContext.Provider;

export function useStore(): RootStore {
  return React.useContext(StoreContext);
}

export function useAuthStore() {
  return useStore().auth;
}

export function useFeedStore() {
  return useStore().feed;
}
