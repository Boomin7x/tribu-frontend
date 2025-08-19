import { bbox } from "@/app/_utils";
import { convertFakeDataCoordinates } from "@/app/_utils/coordinateUtils";
import {
  MapCategoryState,
  setFeatures,
  setToggleMapView as setToggleView,
} from "@/app/store/slice/map_category.slice";
import { RootState } from "@/app/store/store";
import { Feature, FeatureCollection } from "geojson";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { findDensestCell } from "../../_utils";
import { useGetBuildingByCategory } from "./useGetBuildingByCategory";

interface IUseBuildingCategoriesUtils {
  category: string;
}
const useBuildingCategoriesUtils = ({
  category,
}: IUseBuildingCategoriesUtils) => {
  const dispatch = useDispatch();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [, setLimit] = useState(35);

  const globalBbox = useSelector(
    (state: RootState) => state.globalBbox.bbox,
    shallowEqual
  );

  const isView = useSelector(
    (state: RootState) => state.map_many[category]?.toggleMavView,
    shallowEqual
  );
  const roadStore = useSelector(
    (state: RootState) => state.map_many,
    shallowEqual
  );
  const fetchMore = useCallback(() => {
    setLimit((prev) => prev + 10);
  }, []);

  const arrayWithMaxLength = (
    storeData: Record<string, MapCategoryState | undefined>
  ) => {
    return Object.values(storeData).reduce((prevArr, curr) => {
      const features = (curr ?? {}).features ?? [];
      return features.length > prevArr.length ? features : prevArr;
    }, [] as Feature[]);
  };

  const { data, isLoading, isFetching } = useGetBuildingByCategory(
    {
      bbox: globalBbox?.join(",") ?? bbox.params,
      building_category: category,
      // limit,
    },
    true
  );

  const convertedData: FeatureCollection = useMemo(
    () => convertFakeDataCoordinates(data),
    [data]
  );

  console.log({ data, convertedData });

  useEffect(() => {
    if (convertedData?.features?.length) {
      dispatch(
        setFeatures({
          category,
          features: convertedData?.features ?? null,
        })
      );
    }
  }, [category, convertedData, dispatch]);

  const handleIsDetailsOpen = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  const handleToggleView = useCallback(() => {
    dispatch(setToggleView({ category, isOpen: !isView }));
  }, [dispatch, category, isView]);

  const getDensestArea = useCallback(() => {
    const features = convertedData?.features ?? [];
    const { densestPolygon, count } = findDensestCell(
      features as Feature[],
      bbox.params,
      20
    );
    // Optional: zoom to it using the category slice
    // dispatch(setZoomToFeature(densestPolygon));
    return { polygon: densestPolygon, count };
  }, [convertedData, dispatch, category]);

  useEffect(() => {
    const { polygon } = getDensestArea();
    if (polygon) {
      console.log("dense", polygon);
    }
  }, [arrayWithMaxLength.length, dispatch, getDensestArea, roadStore]);

  return {
    data: {
      ...data,
      data: convertedData,
    },
    isView,
    dispatch,
    isLoading,
    fetchMore,
    isDetailsOpen,
    handleToggleView,
    handleIsDetailsOpen,
    isFetching,
  };
};

export default useBuildingCategoriesUtils;
