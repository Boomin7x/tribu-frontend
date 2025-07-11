import { LayerAccordion } from "../../../_component/LayerAccordion";
import { LayerAccordionLoading } from "../../../_component/LayerAccordionLoading";
import { useGetRoadCategories } from "../../_hooks/roads";

export const RoadLayers = () => {
  const { data, isLoading } = useGetRoadCategories();
  const builgCategories = data?.data as string[];
  if (isLoading) {
    return <LayerAccordionLoading />;
  }
  if (!data || !builgCategories?.length) return null;

  return <LayerAccordion category={builgCategories} title="Road Networkss" />;
};
