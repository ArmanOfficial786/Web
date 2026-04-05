// import { apiClient } from "./apiClient";
// import { MemberIdCardRequest } from "../../types/api/api";

// export const memberIdCardService = {
//   getReport: async (payload: MemberIdCardRequest, format = "VIEW") => {
//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format },
//     );

//     return response.data;
//   },
// };

// import { apiClient } from "./apiClient";
// import { MemberIdCardRequest } from "../../types/api/api";

// export const memberIdCardService = {
//   getReport: async (payload: MemberIdCardRequest, format = "VIEW") => {
//     const isDownload = format.toUpperCase() !== "VIEW";

//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format },
//       // ✅ For download formats, tell axios to expect a binary Blob response.
//       // Without this, axios parses the binary as text/JSON and corrupts the file.
//       isDownload ? { format: "blob" } : {},
//     );

//     return response.data;
//   },
// };

import { apiClient } from "./apiClient";
// ✅ Request type  → generated file (auto-updated on regeneration)
import { MemberIdCardRequest } from "../../types/api/api";
// ✅ Response type → hand-written file (never overwritten by the generator)
import { MemberIdCardViewResponse } from "../../types/api/api";

export const memberIdCardService = {
  getReport: async (
    payload: MemberIdCardRequest,
    format = "VIEW",
  ): Promise<MemberIdCardViewResponse | Blob> => {
    const isDownload = format.toUpperCase() !== "VIEW";

    const response = await apiClient.api.memberIdCardMemberIdCardCreate(
      payload,
      { format },
      isDownload ? { format: "blob" } : {},
    );

    // generated return is `void` — single cast lives here and nowhere else
    return response.data as unknown as MemberIdCardViewResponse | Blob;
  },
};
