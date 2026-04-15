import { makeAutoObservable } from 'mobx';

interface LikeState {
  isLiked: boolean;
  likesCount: number;
}

export class FeedStore {
  private likeOverrides = new Map<string, LikeState>();

  constructor() {
    makeAutoObservable(this);
  }

  // Read effective like state (optimistic overrides take precedence)
  getLikeState(postId: string, serverState: LikeState): LikeState {
    return this.likeOverrides.get(postId) ?? serverState;
  }

  // Called immediately on user tap (optimistic update)
  applyOptimisticLike(postId: string, currentState: LikeState) {
    this.likeOverrides.set(postId, {
      isLiked: !currentState.isLiked,
      likesCount: currentState.isLiked
        ? currentState.likesCount - 1
        : currentState.likesCount + 1,
    });
  }

  // Called on API success to sync confirmed server values
  confirmLike(postId: string, serverState: LikeState) {
    this.likeOverrides.set(postId, serverState);
  }

  // Called on API error to roll back optimistic update
  rollbackLike(postId: string, previousState: LikeState) {
    this.likeOverrides.set(postId, previousState);
  }

  clearOverride(postId: string) {
    this.likeOverrides.delete(postId);
  }
}
