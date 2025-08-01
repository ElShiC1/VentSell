import type { Request } from "../types/global/Global";

// types/request.type.ts
type MessageType = 'success' | 'error' | 'warning' | 'info';

interface RequestMessage {
    animation: boolean;
    text: string;
    type: MessageType;
}

interface RequestState {
    loading: boolean | null;
    success: boolean | null;
    message: RequestMessage | null;
}

// types/requestStore.type.ts
interface RequestStoreActions {
    clearMessage: () => void;
    handleError: (error: unknown, noError: string) => void;
}


let fadeOutTimeoutId: ReturnType<typeof setTimeout> | null = null;
let clearTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const createRequestStore = <T,>(
  set: (fn: (prev: Request<T> | any) => Request<T> | any) => void
) => ({
  clearMessage: () => {
    // Limpiar timeouts anteriores antes de crear nuevos
    if (fadeOutTimeoutId) clearTimeout(fadeOutTimeoutId);
    if (clearTimeoutId) clearTimeout(clearTimeoutId);

    fadeOutTimeoutId = setTimeout(() => {
      set((state) => ({
        request: {
          ...state.request,
          message: {
            ...state.request.message!,
            animation: false,
          },
        }
      }));

      clearTimeoutId = setTimeout(() => {
        set((state) => ({
          request: { message: undefined, success: null, loading: null }
        }));
      }, 300);
    }, 1800);
  },

  handleError: (error: unknown, noError: string) => {
    set(() => ({
      request: {
        loading: false,
        success: false,
        message: {
          animation: true,
          text: error instanceof Error ? error.message : noError,
          type: 'error'
        }
      }
    }));
  }
});
