import { useMutation } from '@tanstack/react-query';
import {
    summaryApi,
    GetTranscriptRequest,
    CreateSummaryRequest,
    CreateTtsRequest,
    CreateFullTextTtsRequest,
} from '@/lib/api';
import { useSummaryStore } from '@/store/useSummaryStore';

/**
 * 전체 자막 텍스트 추출 훅
 */
export const useGetTranscript = () => {
    const { setStage, setTranscript, setError, setLoading } = useSummaryStore();

    return useMutation({
        mutationFn: async (data: GetTranscriptRequest) => {
            setLoading(true);
            setStage('extracting');
            return await summaryApi.getTranscript(data);
        },
        onSuccess: (data) => {
            setTranscript(data);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                '자막 추출 중 오류가 발생했습니다.';
            setError(errorMessage);
        },
    });
};

/**
 * 요약 생성 훅
 */
export const useCreateSummary = () => {
    const { setSummary, setError, setSummarizing } = useSummaryStore();

    return useMutation({
        mutationFn: async (data: CreateSummaryRequest) => {
            setSummarizing(true);
            return await summaryApi.createSummary(data);
        },
        onSuccess: (data) => {
            setSummary(data);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                '요약 생성 중 오류가 발생했습니다.';
            setError(errorMessage);
        },
    });
};

/**
 * 요약 TTS 생성 훅
 */
export const useCreateTts = () => {
    const { setSummaryAudioUrl, setError, setTtsLoading } = useSummaryStore();

    return useMutation({
        mutationFn: async (data: CreateTtsRequest) => {
            setTtsLoading(true);
            return await summaryApi.createTts(data);
        },
        onSuccess: (data) => {
            setSummaryAudioUrl(data.audioUrl);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'TTS 생성 중 오류가 발생했습니다.';
            setError(errorMessage);
            setTtsLoading(false);
        },
    });
};

/**
 * 전체 텍스트 TTS 생성 훅
 */
export const useCreateFullTextTts = () => {
    const { setFullTextAudioUrl, setError, setFullTextTtsLoading } = useSummaryStore();

    return useMutation({
        mutationFn: async (data: CreateFullTextTtsRequest) => {
            setFullTextTtsLoading(true);
            return await summaryApi.createFullTextTts(data);
        },
        onSuccess: (data) => {
            setFullTextAudioUrl(data.audioUrl);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                '전체 텍스트 TTS 생성 중 오류가 발생했습니다.';
            setError(errorMessage);
            setFullTextTtsLoading(false);
        },
    });
};
