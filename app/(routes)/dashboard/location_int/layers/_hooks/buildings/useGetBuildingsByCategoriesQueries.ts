import { useQueries, useQuery } from "@tanstack/react-query";
import { buildingsApi } from "../../_utils/service/buildingsApi";

type UseGetBuildingsByCategoriesQueriesProps = {
  categories: string[];
  enabled?: boolean;
};

const useGetBuildingsByCategoriesQueries = ({
  categories,
  enabled = true,
}: UseGetBuildingsByCategoriesQueriesProps) => {
  return useQueries({
    queries: categories.map((category) => ({
      queryKey: ["buildings", category],
      queryFn: () => buildingsApi.getBuildingbyCategory(params),
      enabled,
    })),
  });
};

interface UseBuildingCategoryManagerParams {
  categories: string[];
  bbox: string;
  defaultLimit?: number;
  defaultPage?: number;
}

interface CategoryQueryState {
  limit: number;
  page: number;
  enabled: boolean;
}

export const useBuildingCategoryManager = ({
  categories,
  bbox,
  defaultLimit = 10,
  defaultPage = 1,
}: UseBuildingCategoryManagerParams) => {
  // State for each category's pagination
  const [categoryStates, setCategoryStates] = useState<
    Record<string, CategoryQueryState>
  >(() =>
    categories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: {
          limit: defaultLimit,
          page: defaultPage,
          enabled: true,
        },
      }),
      {}
    )
  );

  // Create individual queries for each category
  const queries = categories.map((category) => {
    const state = categoryStates[category];
    return useQuery({
      queryKey: [
        MAP_QUERY_KEY.GET_BUILDING_BY_CATEGORY,
        {
          building_category: category,
          bbox,
          limit: state.limit,
          page: state.page,
        },
      ],
      queryFn: () =>
        buildingsApi.getBuildingbyCategory({
          building_category: category,
          bbox,
          limit: state.limit,
          page: state.page,
        }),
      enabled: state.enabled,
    });
  });

  // Helper functions to update individual category states
  const updateCategoryPage = (category: string, page: number) => {
    setCategoryStates((prev) => ({
      ...prev,
      [category]: { ...prev[category], page },
    }));
  };

  const updateCategoryLimit = (category: string, limit: number) => {
    setCategoryStates((prev) => ({
      ...prev,
      [category]: { ...prev[category], limit },
    }));
  };

  const toggleCategoryEnabled = (category: string) => {
    setCategoryStates((prev) => ({
      ...prev,
      [category]: { ...prev[category], enabled: !prev[category].enabled },
    }));
  };

  return {
    queries: queries.map((query, index) => ({
      ...query,
      category: categories[index],
      state: categoryStates[categories[index]],
    })),
    actions: {
      updateCategoryPage,
      updateCategoryLimit,
      toggleCategoryEnabled,
    },
  };
};

export default useGetBuildingsByCategoriesQueries;
