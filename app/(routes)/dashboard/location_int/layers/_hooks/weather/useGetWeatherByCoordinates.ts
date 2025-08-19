import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../../_utils/service/weatherApi";
import { IWeatherByCoordinateParams } from "../../_utils/types/weatherTypes";

const useGetWeatherByCoordinates = (
  params: IWeatherByCoordinateParams,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["weather-by-coordinates", params],
    queryFn: () => weatherApi.getWeatherByCoordinates(params),
    enabled,
  });
};

export default useGetWeatherByCoordinates;
