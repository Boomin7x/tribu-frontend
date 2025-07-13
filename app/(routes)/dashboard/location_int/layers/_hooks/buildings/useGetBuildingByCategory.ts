import { useQuery } from "@tanstack/react-query";
import { IGetBuildingByCategoryParams } from "../../_utils/types/buildings/buildings_types";
import { MAP_QUERY_KEY } from "../../_utils/enum";
import { buildingsApi } from "../../_utils/service/buildingsApi";

export const useGetBuildingByCategory = (
  params: IGetBuildingByCategoryParams
) => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_BUILDING_BY_CATEGORY, params],
    queryFn: () => buildingsApi.getBuildingbyCategory(params),
  });
};
