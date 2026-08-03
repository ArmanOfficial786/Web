import { Api } from "types/api/api";
import {
  requestInterceptor,
  successResponseInterceptor,
  errorResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ── API Instance ──────────────────────────────────────────────────────────────
const savingTypeWiseIndividualBalanceService = new Api({ baseURL: apiUrl });

// ✅ Key fix: Configure request interceptor to set responseType based on format param
// Both VIEW and EXPORT get blob response
const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  // Call original interceptor for auth headers, etc.
  const configWithAuth = await originalRequestInterceptor(config);

  // ✅ If format is VIEW/PDF/WORD/EXCEL/IMAGE, set responseType to blob
  // This applies to BOTH view and export requests
  if (configWithAuth.params?.format) {
    const format = configWithAuth.params.format.toLowerCase();
    if (["view", "pdf", "word", "excel", "image"].includes(format)) {
      configWithAuth.responseType = "blob";
    }
  }

  return configWithAuth;
};

savingTypeWiseIndividualBalanceService.instance.interceptors.request.use(
  customRequestInterceptor,
);
savingTypeWiseIndividualBalanceService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default savingTypeWiseIndividualBalanceService;
