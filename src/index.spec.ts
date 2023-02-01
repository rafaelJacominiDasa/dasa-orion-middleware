import axios from "axios";
import { OrionRequest } from "./";
import { format } from "date-fns";

jest.mock("axios");

describe("OrionRequest", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const UUID = "123";
  const dataType = "test";
  const dataLake = false;
  const level = "info";
  const dateEvent = 1612484800000;

  it("should return the correct data when the GET request is successful", async () => {
    const mockedData = { data: { foo: "bar" } };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockedData
    );
    const dateEventFormatted = format(
      new Date(dateEvent),
      "yyyy-MM-dd HH:mm:ss.SSS"
    );

    const orionRequest = new OrionRequest({});
    const response = await orionRequest.orionRequest({
      UUID,
      dataType,
      dataLake,
      level,
      dateEvent,
    });

    expect(response).toEqual(mockedData.data);
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.BASE_URL}/${UUID}/?dataType=${encodeURIComponent(
        dataType
      )}&dataLake=${dataLake}&level=${encodeURIComponent(
        level
      )}&eventDate=${dateEventFormatted}`
    );
  });

  it("should throw an error when the GET request is unsuccessful", async () => {
    const error = new Error("Request failed with status code 404");
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(
      error
    );

    const orionRequest = new OrionRequest({});
    try {
      await orionRequest.orionRequest({
        UUID,
        dataType,
        dataLake,
        level,
        dateEvent,
      });
      fail("The GET request should have failed");
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
