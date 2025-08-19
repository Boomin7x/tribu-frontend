import mapClient from "@/app/config/map_client_config";
import {
  IWeatherByCoordinateParams,
  IWeatherByZoneParams,
} from "../types/weatherTypes";

export const weatherApi = {
  getWeatherByCoordinates: async (
    weatherByCoordinateParams: IWeatherByCoordinateParams
  ) => {
    const params = Object.fromEntries(
      Object.entries(weatherByCoordinateParams).filter(
        ([, value]) => value !== undefined && value !== null
      )
    );
    const response = await mapClient.get(`/weather`, {
      params,
    });
    return response.data;
  },
  getWeatherByZone: async (weatherByZoneParams: IWeatherByZoneParams) => {
    const result = await mapClient.get(
      `/weather/${weatherByZoneParams.zone_id}`
    );
    return result.data;
  },
};
