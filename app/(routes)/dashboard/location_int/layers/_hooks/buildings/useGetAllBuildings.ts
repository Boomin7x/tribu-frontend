import { useQuery } from "@tanstack/react-query";
import { IGetAllBuildingsParams } from "../../_utils/types/buildings/buildings_types";
import { MAP_QUERY_KEY } from "../../_utils/enum";
import { buildingsApi } from "../../_utils/service/buildingsApi";

export const useGetAllBuildings = (params: IGetAllBuildingsParams) => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_ALL_BUILDINGS, params],
    queryFn: () => buildingsApi.getAllBuildings(params),
  });
};
