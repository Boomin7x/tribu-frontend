import { LayerAccordion } from "../../../_component/LayerAccordion";
import { LayerAccordionLoading } from "../../../_component/LayerAccordionLoading";
import { useGetBuildingCategories } from "../../_hooks/buildings";

export const BuildingLayers = () => {
  const { data, isLoading } = useGetBuildingCategories();
  const builgCategories = data?.data as string[];

  if (isLoading) {
    return <LayerAccordionLoading />;
  }
  if (!data || !builgCategories?.length) return null;

  return <LayerAccordion category={builgCategories} title="Buildings" />;
};
