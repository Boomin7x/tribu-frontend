export interface IWeatherByCoordinateParams {
  lat: number;
  lon: number;
  buffer_radius: number;
}

export interface IWeatherByZoneParams {
  zone_id: string;
}
