export interface IGetBuildingByCategoryParams {
  building_category: string;
  bbox: string;
  limit?: number;
  page?: number;
}

export interface IBbox {
  min_lat: number | string;
  max_lat: number | string;
  min_lon: number | string;
  max_lon: number | string;
}
export interface IGetAllBuildingsParams {
  bbox: IBbox | string;
  limit?: number;
  page?: number;
}

export type GetBuildingCategoriesResponse = {
  message: string;
  data: string[];
};
