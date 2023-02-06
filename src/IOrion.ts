export interface IOrion {
  date: number;
  UUID: string;
  dataType: string;
  dataLake?: boolean;
  level?: "info" | "warn" | "error" | "critical" | "debug";
  dateEvent: number;
}
