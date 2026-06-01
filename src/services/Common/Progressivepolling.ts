import { apiClient } from "../apiClient";

export interface ProgressivePollResult {
  blob: Blob;
  pagesReady: number;
  isComplete: boolean;
  totalChunks: number;
  completedChunks: number;
  sizeBytes: number;
  estimatedPages: number;
}

const savingAcWiseBalanceProgressiveService = {
  getProgressivePdf: async (
    jobId: string,
    signal?: AbortSignal,
  ): Promise<ProgressivePollResult> => {
    const response = await apiClient.instance.get<Blob>(
      `/api/SavingACWiseBalanceReport/progressive/${jobId}`,
      {
        responseType: "blob",
        silentSuccess: true, // suppress success toast — polling is silent
        signal,
      },
    );

    const h = response.headers;

    return {
      blob: response.data,
      pagesReady: parseInt(h["x-pages-ready"] ?? "0", 10),
      isComplete: h["x-is-complete"] === "True",
      totalChunks: parseInt(h["x-total-chunks"] ?? "0", 10),
      completedChunks: parseInt(h["x-completed-chunks"] ?? "0", 10),
      sizeBytes: parseInt(h["x-size-bytes"] ?? "0", 10),
      estimatedPages: parseInt(h["x-estimated-pages"] ?? "0", 10),
    };
  },
};

export default savingAcWiseBalanceProgressiveService;
