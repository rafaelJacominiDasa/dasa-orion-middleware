import axios, { AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { format } from "date-fns";

const { BASE_URL } = process.env;

interface QueryParams {
  UUID: string;
  dataType: string;
  dataLake?: boolean;
  level?: "info" | "warn" | "error" | "critical" | "debug";
  dateEvent: number;
}

interface Options {
  retry?: number;
  retryDelay?: (retryCount: number) => number;
}

export class OrionRequest {
  constructor(options: Options) {
    const defaultOptions: Options = {
      retry: options.retry || 3,
      retryDelay: (retryCount: number) => {
        return retryCount * 3000;
      },
    };

    axiosRetry(axios, defaultOptions);
  }

  public async orionRequest(params: QueryParams) {
    const {
      UUID,
      dataType,
      dataLake = false,
      level = "info",
      dateEvent,
    } = params;
    const dateEventFormatted = format(
      new Date(dateEvent),
      "yyyy-MM-dd HH:mm:ss.SSS"
    );
    const url = `${BASE_URL}/${UUID}/?dataType=${encodeURIComponent(
      dataType
    )}&dataLake=${dataLake}&level=${encodeURIComponent(
      level
    )}&eventDate=${dateEventFormatted}`;

    try {
      const response = await axios.post(url);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
