import { Feature } from "geojson";
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

export type TBuildingsGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

export type TBuildingProperties = {
  building: string | null;
  amenity: string | null;
  shop: string | null;
  office: string | null;
  tourism: string | null;
  landuse: string | null;
};

export type TBuildingFeature = {
  type: "Feature";
  id: number;
  geometry: TBuildingsGeometry;
  properties: TBuildingProperties;
};

export type TBuildingFeatureCollection = {
  type: "FeatureCollection";
  features: Feature[];
};

export type IBuildingApiResponse = {
  message: string;
  data: TBuildingFeatureCollection;
  limit: number;
  page: number;
};
