import { useQuery } from "@tanstack/react-query";
import { roadsApi } from "../../_utils/service/roadApi";
import { IGetJunctionParams } from "../../_utils/types/road_types";
import { MAP_QUERY_KEY } from "../../_utils/enum";

export const useGetJunctions = (params: IGetJunctionParams) => {
  return useQuery({
    queryKey: [MAP_QUERY_KEY.GET_JUNCTIONS, params],
    queryFn: () => roadsApi.getJunctions(params),
  });
};
