import mapClient from "@/app/config/map_client_config";
import {
  ICategoryroadsParams,
  IGetAllRoadParams,
  IGetJunctionParams,
} from "../types/road_types";

export const roadsApi = {
  getAllroads: async ({ bbox, limit, page }: IGetAllRoadParams) => {
    const params = {
      ...(bbox && { bbox }),
      ...(limit && { limit }),
      ...(page && { page }),
    };
    const result = await mapClient.get("/roads", {
      params,
    });
    return result?.data;
  },

  getroadCategories: async () => {
    const result = await mapClient.get("/roads/categories");
    return result?.data;
  },

  getJunctions: async ({ junction_type_code, limit }: IGetJunctionParams) => {
    const params = {
      ...(junction_type_code && { junction_type_code }),
      ...(limit && { limit }),
    };
    const result = await mapClient.get("/roads/junctions", { params });
    return result?.data;
  },

  getCategoryrRoads: async ({
    bbox,
    category,
    limit,
    page,
  }: ICategoryroadsParams) => {
    const params = {
      ...(bbox && { bbox }),
      ...(category && { category }),
      ...(limit && { limit }),
      ...(page && { page }),
    };
    const result = await mapClient.get("/category/roads", { params });
    return result?.data;
  },
};
