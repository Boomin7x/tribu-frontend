import { useQuery } from "@tanstack/react-query";
import { roadsApi } from "../../_utils/service/roadApi";
import { ICategoryroadsParams } from "../../_utils/types/road_types";
import { MAP_QUERY_KEY } from "../../_utils/enum";

export const useGetCategoryRoads = (params: ICategoryroadsParams) => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_CATEGORY_ROADS, params],
    queryFn: () => roadsApi.getCategoryrRoads(params),
  });
};
