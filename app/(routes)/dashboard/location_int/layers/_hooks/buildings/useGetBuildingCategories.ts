import { useQuery } from "@tanstack/react-query";
import { MAP_QUERY_KEY } from "../../_utils/enum";
import { buildingsApi } from "../../_utils/service/buildingsApi";

export const useGetBuildingCategories = () => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_BUILDING_CATEGORIES],
    queryFn: () => buildingsApi.getBuildingCategories(),
  });
};
