import mapClient from "@/app/config/map_client_config";
import {
  GetBuildingCategoriesResponse,
  IGetAllBuildingsParams,
  IGetBuildingByCategoryParams,
} from "../types/buildings_types";

export const buildingsApi = {
  getBuildingCategories: async (): Promise<GetBuildingCategoriesResponse> => {
    const result = await mapClient.get("/buildings/categories");
    return result?.data;
  },

  getBuildingbyCategory: async ({
    bbox,
    building_category,
    limit,
    page,
  }: IGetBuildingByCategoryParams) => {
    const params = {
      ...(bbox && { bbox }),
      ...(building_category && { building_category }),
      ...(limit && { limit }),
      ...(page && { page }),
    };
    const result = await mapClient.get("/category/buildings", {
      params,
    });
    return result?.data;
  },

  getAllBuildings: async ({ bbox, limit, page }: IGetAllBuildingsParams) => {
    const params = {
      ...(bbox && { bbox }),
      ...(limit && { limit }),
      ...(page && { page }),
    };
    const result = await mapClient.get("/buildings", {
      params,
    });
    return result?.data;
  },
};
