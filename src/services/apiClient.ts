import { Api } from "../../types/api/api";

export const apiClient = new Api({
  baseURL: "http://localhost:5106", // your backend HTTP URL
});

//no use of apiClient instead of it use .env
