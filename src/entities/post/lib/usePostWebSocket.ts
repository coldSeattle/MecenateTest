import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@app-layer/providers/RootStore';
import { commentsQueryKey } from '@entities/comment/lib/useComments';

const WS_BASE = 'wss://k8s.mectest.ru/test-app/ws';

interface WsEvent {
  type: 'like_updated' | 'comment_added';
  data?: unknown;
}

interface UsePostWebSocketOptions {
  postId: string;
  onNewComments: () => void;
}

export function usePostWebSocket({ postId, onNewComments }: UsePostWebSocketOptions) {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);
  const onNewCommentsRef = useRef(onNewComments);
  onNewCommentsRef.current = onNewComments;

  const connect = useCallback(() => {
    const token = authStore.token;
    if (!token || !postId) return;

    const url = `${WS_BASE}?token=${encodeURIComponent(token)}&postId=${encodeURIComponent(postId)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg: WsEvent = JSON.parse(event.data as string);
        if (msg.type === 'like_updated') {
          queryClient.invalidateQueries({ queryKey: ['post', postId] });
        } else if (msg.type === 'comment_added') {
          onNewCommentsRef.current();
          queryClient.invalidateQueries({ queryKey: commentsQueryKey(postId), refetchType: 'none' });
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => { wsRef.current = null; };
  }, [postId, authStore, queryClient]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);
}
