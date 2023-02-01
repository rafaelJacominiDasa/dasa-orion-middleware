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

const defaultOptions: Options = {
  retry: 3,
  retryDelay: (retryCount: number) => {
    return retryCount * 1000;
  },
};

export class OrionRequest {
  private options: Options;

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options };
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

    const axiosInstance = axios.create();
    axiosRetry(axiosInstance, this.options);

    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
