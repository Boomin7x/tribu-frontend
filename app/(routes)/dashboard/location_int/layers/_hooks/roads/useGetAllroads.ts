import { useQuery } from "@tanstack/react-query";
import { IGetAllRoadParams } from "../../_utils/types/road_types";
import { MAP_QUERY_KEY } from "../../_utils/enum";
import { roadsApi } from "../../_utils/service/roadApi";

export const useGetAllroads = (params: IGetAllRoadParams) => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_ALL_ROADS, params],
    queryFn: () => roadsApi.getAllroads(params),
  });
};
