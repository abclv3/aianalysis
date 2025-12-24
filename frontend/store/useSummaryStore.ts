import { create } from 'zustand';

/**
 * 요약 결과 데이터
 */
export interface SummaryResult {
    videoId: string;
    videoTitle: string;
    summary: string[];
    fullScript: string;
    timestamp: string;
}

/**
 * 스토어 상태
 */
interface SummaryStore {
    // 상태
    result: SummaryResult | null;
    error: string | null;
    isLoading: boolean;

    // 액션
    setResult: (result: SummaryResult) => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
}

/**
 * Zustand 스토어 (Munto 스타일)
 */
export const useSummaryStore = create<SummaryStore>((set) => ({
    // 초기 상태
    result: null,
    error: null,
    isLoading: false,

    // 액션
    setResult: (result) => set({ result, error: null, isLoading: false }),
    setError: (error) => set({ error, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading, error: null }),
    reset: () => set({ result: null, error: null, isLoading: false }),
}));
