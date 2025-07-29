import { useQuery } from "@tanstack/react-query";
import { ICategoryroadsParams } from "../../_utils/types/road_types";
import { MAP_QUERY_KEY } from "../../_utils/enum";
import { roadsApi } from "../../_utils/service/roadApi";

export const useGetCategoryRoads = (
  params: ICategoryroadsParams,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_CATEGORY_ROADS, params],
    queryFn: () => roadsApi.getCategoryrRoads(params),
    enabled,
  });
};
