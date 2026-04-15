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

  getLikeState(postId: string, serverState: LikeState): LikeState {
    return this.likeOverrides.get(postId) ?? serverState;
  }

  applyOptimisticLike(postId: string, currentState: LikeState) {
    this.likeOverrides.set(postId, {
      isLiked: !currentState.isLiked,
      likesCount: currentState.isLiked
        ? currentState.likesCount - 1
        : currentState.likesCount + 1,
    });
  }

  confirmLike(postId: string, serverState: LikeState) {
    this.likeOverrides.set(postId, serverState);
  }

  rollbackLike(postId: string, previousState: LikeState) {
    this.likeOverrides.set(postId, previousState);
  }

  clearOverride(postId: string) {
    this.likeOverrides.delete(postId);
  }
}
