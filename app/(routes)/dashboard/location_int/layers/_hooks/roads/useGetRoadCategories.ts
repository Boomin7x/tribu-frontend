import { useQuery } from "@tanstack/react-query";
import { MAP_QUERY_KEY } from "../../_utils/enum";
import { roadsApi } from "../../_utils/service/roadApi";

export const useGetRoadCategories = () => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_ROAD_CATEGORIES],
    queryFn: () => roadsApi.getroadCategories(),
  });
};
