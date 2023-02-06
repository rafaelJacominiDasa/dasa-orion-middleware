// Orion.ts
import {
  EventHubProducerClient,
  EventData as EventHubEventData,
} from "@azure/event-hubs";
const { EventData } = require("@azure/event-hubs");
import { format } from "date-fns";
import validator from "validator";
import { IOrion } from "./IOrion";

const { CONNECT_STRING } = process.env;
export class Orion {
  private producer: EventHubProducerClient;

  constructor(connectionString: string = <string>CONNECT_STRING) {
    this.producer = new EventHubProducerClient(connectionString);
  }

  public async sendData(data: IOrion) {
    const formattedDate = format(data.date, "yy/MM/dd");
    if (!data.UUID || !validator.isLength(data.UUID, { min: 10, max: 60 })) {
      throw new Error("UUID must be between 10 and 60 characters long");
    }

    if (
      !data.dataType ||
      !validator.isLength(data.dataType, { min: 5, max: 60 })
    ) {
      throw new Error("dataType must be between 5 and 60 characters long");
    }

    if (data.date && isNaN(new Date(data.date).getTime())) {
      throw new Error("Date is not a valid timestamp");
    }

    if (data.dateEvent && isNaN(new Date(data.dateEvent).getTime())) {
      throw new Error(
        "dateEvent is not a valid timestamp or date with pattern: yyyy-MM-dd HH:mm:ss.SSS"
      );
    }

    const eventData = { date: formattedDate };
    const event = new EventData(Buffer.from(JSON.stringify(eventData)));
    await this.producer.sendBatch(event);

    await this.producer.close();
  }
}
