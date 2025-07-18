import { JunctionType } from "../enum";

export interface IGetAllRoadParams {
  bbox: string;
  limit?: number;
  page?: number;
}

export interface IGetJunctionParams {
  junction_type_code: JunctionType;
  limit?: number;
}

export interface ICategoryroadsParams {
  category: string;
  bbox: string;
  limit?: number;
  page?: number;
}
