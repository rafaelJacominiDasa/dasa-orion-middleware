// Unit Test
import { Orion } from "./";
import { EventHubProducerClient } from "@azure/event-hubs";
import { IOrion } from "./IOrion";

describe("Orion", () => {
  let orion: Orion;

  beforeEach(() => {
    const connectionString =
      "Endpoint=sb://example.servicebus.windows.net/;SharedAccessKeyName=example;SharedAccessKey=example";
    orion = new Orion(connectionString);
  });

  it("should create an instance of EventHubProducerClient", () => {
    expect(orion["producer"]).toBeInstanceOf(EventHubProducerClient);
  });

  it("should throw an error if UUID is not between 10 and 60 characters long", async () => {
    const data: IOrion = {
      UUID: "123456789",
      date: 0,
      dataType: "",
      dateEvent: 0,
    };

    await expect(orion.sendData(data)).rejects.toThrowError(
      "UUID must be between 10 and 60 characters long"
    );
  });

  it("should throw an error if dataType is not between 5 and 60 characters long", async () => {
    const data: IOrion = {
      UUID: "1234567890123456",
      dataType: "123",
      date: 0,
      dateEvent: 0,
    };

    await expect(orion.sendData(data)).rejects.toThrowError(
      "dataType must be between 5 and 60 characters long"
    );
  });
});
