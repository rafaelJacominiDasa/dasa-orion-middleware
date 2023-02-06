// Orion.ts
import { EventHubProducerClient } from "@azure/event-hubs";
const { EventData } = require("@azure/event-hubs");
import { format } from "date-fns";
import validator from "validator";
import { IOrion } from "./IOrion";

const { CONNECT_STRING } = process.env;

class Orion {
  private producer: EventHubProducerClient;
  /**
   *
   * @param connectionString If not data is sent, process.env.CONNECT_STRING will be used
   */
  constructor(connectionString: string = <string>CONNECT_STRING) {
    this.producer = new EventHubProducerClient(connectionString);
  }
  /**
   * Send data to Hubs
   *
   * Example usage:
   * ```ts
   * const client = new Orion(connectionString);
   * await client.sendData({
      UUID: "UMUUIDQUALQUER",
      date: new Date(),
      level: "critical",
      dataType: "tipo de dado",
    });
   * ```
   * Sends data to an event hub
   * @param {IOrion} data - Data to be sent
   * @param {string} data.UUID - Required, at least 10 characters and max 60 characters
   * @param {string} data.dataType - Required, at least 5 characters and max 60 characters
   * @param {number} [data.date] - Timestamp
   * @param {boolean} [data.dataLake] - Indicates if the data is stored in a data lake
   * @param {"info" | "warn" | "error" | "critical" | "debug"} [data.level] - The level of the data
   * @param {number} [data.dateEvent] - Timestamp or date with pattern: yyyy-MM-dd HH:mm:ss.SSS
   * @throws {Error} - If UUID is not provided or is not between 10 and 60 characters long
   * @throws {Error} - If dataType is not provided or is not between 5 and 60 characters long
   * @throws {Error} - If date is provided but is not a valid timestamp
   * @throws {Error} - If dateEvent is provided but is not a valid timestamp or date with pattern: yyyy-MM-dd HH:mm:ss.SSS
   **/
  public async sendData(data: IOrion): Promise<void> {
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

module.exports = Orion;
