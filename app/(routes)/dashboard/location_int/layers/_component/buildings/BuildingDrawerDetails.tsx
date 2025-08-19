import { BUILDING_CATEGORY_COLORS } from "@/app/_hooks/useBuildingUtils";
import { cn } from "@/app/lib/tailwindLib";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Feature } from "geojson";
import {
  Fragment,
  memo,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useInView } from "react-intersection-observer";
import { isColorLight } from "../../_utils";
import { IBuildingApiResponse } from "../../_utils/types/buildings/buildings_types";
import RoadDrawerDetailsSkeleton from "../roads/roadDrawerDetailsSkeleton";
import MapCategoryDetailsDrawerLayout from "./MapCategoryDetailDrawer";
import { Icon } from "@iconify/react";
import { alpha, darken } from "@mui/material/styles";

interface IBuildingDrawerDetails {
  open: boolean;
  onClose: () => void;
  data: IBuildingApiResponse;
  onZoomToFeature?: (feature: Feature) => void;
  isLoading?: boolean;
  category: string;
  fetchMore: () => void;
  isFetching?: boolean;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
  categoryColor: string;
  expandedFeatures: Set<number>;
  toggleFeature: (id: number) => void;
  getBuildingIcon: (building: string | null) => React.ReactNode;
  formatCoordinates: (coordinates: number[][][]) => string;
  calculateArea: (coordinates: number[][][]) => number;
  onZoomToFeature?: (feature: Feature) => void;
  onClose?: () => void;
  isColorLight: (hexColor: string) => boolean;
}

const FeatureCard = memo(
  ({
    feature,
    index,
    categoryColor,
    expandedFeatures,
    toggleFeature,
    getBuildingIcon,
    formatCoordinates,
    calculateArea,
    onZoomToFeature,
    onClose,
    isColorLight,
  }: FeatureCardProps) => {
    return (
      <Fragment key={feature.id}>
        <Card
          className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700"
          sx={{
            borderColor: categoryColor,
            "&:hover": { borderColor: categoryColor },
          }}
        >
          <ListItemButton
            onClick={() => toggleFeature(feature?.id as number)}
            className="p-4"
            sx={{ "&:hover": { backgroundColor: categoryColor + "22" } }}
          >
            <ListItemIcon>
              <Badge
                badgeContent={index + 1}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {getBuildingIcon(feature.properties?.building)}
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary={
                <Box className="flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-semibold">
                    {feature.properties?.building || "Unknown"} #{feature.id}
                  </Typography>
                  <Chip
                    label={feature.geometry.type}
                    size="small"
                    sx={{
                      backgroundColor: categoryColor,
                      color: isColorLight(categoryColor) ? "#111827" : "#fff",
                      borderColor: categoryColor,
                    }}
                    variant="outlined"
                    className="ml-2"
                  />
                </Box>
              }
              secondary={
                <Typography variant="body2" className="!text-gray-800">
                  {formatCoordinates(
                    (feature.geometry as { coordinates: number[][][] })
                      .coordinates
                  )}
                </Typography>
              }
            />
            <IconButton size="small">
              {expandedFeatures.has(feature.id as number) ? (
                <Icon icon="mdi:chevron-up" className="w-5 h-5" />
              ) : (
                <Icon icon="mdi:chevron-down" className="w-5 h-5" />
              )}
            </IconButton>
          </ListItemButton>
          <Collapse
            in={expandedFeatures.has(feature.id as number)}
            timeout="auto"
          >
            <Divider />
            <CardContent sx={{ backgroundColor: categoryColor + "11" }}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    className="font-semibold mb-2 flex items-center"
                  >
                    <Icon
                      icon="mdi:information"
                      className="w-4 h-4 mr-1"
                      style={{ color: categoryColor }}
                    />
                    Properties
                  </Typography>
                  <Box className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(feature.properties ?? {}).map(
                      ([key, value]) => (
                        <Box key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key}:
                          </span>
                          <span className="font-medium">
                            {String(value) || "null"}
                          </span>
                        </Box>
                      )
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    className="font-semibold mb-2 flex items-center"
                  >
                    <Icon
                      icon="mdi:map-marker"
                      className="w-4 h-4 mr-1"
                      style={{ color: categoryColor }}
                    />
                    Geometry
                  </Typography>
                  <Box className="space-y-1 text-sm">
                    <Box className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {feature.geometry.type}
                      </span>
                    </Box>
                    <Box className="flex justify-between">
                      <span className="text-gray-600">Points:</span>
                      <span className="font-medium">
                        {
                          (feature.geometry as { coordinates: number[][][] })
                            .coordinates[0].length
                        }
                      </span>
                    </Box>
                    <Box className="flex justify-between">
                      <span className="text-gray-600">Est. Area:</span>
                      <span className="font-medium">
                        {calculateArea(
                          (feature.geometry as { coordinates: number[][][] })
                            .coordinates
                        ).toLocaleString()}{" "}
                        m²
                      </span>
                    </Box>
                  </Box>
                </Box>
                {onZoomToFeature && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      onZoomToFeature(feature);
                      if (onClose) onClose();
                    }}
                    className="mt-2"
                    sx={{
                      color: "white",
                      backgroundColor: categoryColor,
                      "&:hover": {
                        backgroundColor: darken(categoryColor, 0.2),
                      },
                    }}
                  >
                    Zoom to on Map
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Collapse>
        </Card>
      </Fragment>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

const BuildingDrawerDetails = memo<IBuildingDrawerDetails>(
  ({
    category,
    data,
    fetchMore,
    onClose,
    open,
    isFetching = false,
    isLoading = false,
    onZoomToFeature,
  }) => {
    const categoryColor = useMemo(
      () => BUILDING_CATEGORY_COLORS[category] || "#8B5CF6",
      [category]
    );
    const { inView, ref } = useInView({ threshold: 1 });
    useEffect(() => {
      if (inView) fetchMore();
    }, [inView, fetchMore]);
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(
      new Set()
    );
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const getBuildingIcon = useCallback(
      (building: string | null) => {
        switch (building) {
          case "school":
            return (
              <Icon
                icon="mdi:school"
                className={cn(
                  "text-purple-500 w-6 h-6",
                  categoryColor && `text-[${categoryColor}]`
                )}
                style={{
                  color: categoryColor,
                }}
              />
            );
          case "public":
            return (
              <Icon
                icon="mdi:office-building"
                className={cn(
                  "text-purple-500 w-6 h-6",
                  categoryColor && `text-[${categoryColor}]`
                )}
                style={{
                  color: categoryColor,
                }}
              />
            );
          case "office":
            return (
              <Icon
                icon="mdi:briefcase"
                className={cn(
                  "text-purple-500 w-6 h-6",
                  categoryColor && `text-[${categoryColor}]`
                )}
                style={{
                  color: categoryColor,
                }}
              />
            );
          default:
            return (
              <Icon
                icon="mdi:map-marker"
                className={cn(
                  "text-purple-500 w-6 h-6",
                  categoryColor && `text-[${categoryColor}]`
                )}
                style={{
                  color: categoryColor,
                }}
              />
            );
        }
      },
      [categoryColor]
    );
    const filteredFeatures = useMemo(
      () =>
        data?.data?.features.filter((feature) => {
          const matchesSearch =
            searchTerm === "" ||
            feature.properties?.building
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            feature.id?.toString().includes(searchTerm);
          const matchesFilter =
            selectedFilter === "all" ||
            feature.properties?.building === selectedFilter;
          return matchesSearch && matchesFilter;
        }) ?? [],
      [data?.data?.features, searchTerm, selectedFilter]
    );
    const buildingTypes = useMemo(() => {
      const types = new Set(
        data?.data?.features.map((f) => f.properties?.building).filter(Boolean)
      );
      return Array.from(types);
    }, [data?.data?.features]);
    const toggleFeature = useCallback((featureId: number) => {
      setExpandedFeatures((prev) => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(featureId)) {
          newExpanded.delete(featureId);
        } else {
          newExpanded.add(featureId);
        }
        return newExpanded;
      });
    }, []);
    const calculateArea = useCallback((coordinates: number[][][]) => {
      const polygon = coordinates[0];
      return polygon.length * 100;
    }, []);
    const formatCoordinates = useCallback((coordinates: number[][][]) => {
      const polygon = coordinates[0];
      return `${polygon.length} points`;
    }, []);
    if (isLoading) {
      return (
        <Drawer
          anchor="right"
          title="Buildings Data Viewer"
          open={open}
          onClose={onClose}
        >
          <RoadDrawerDetailsSkeleton />
        </Drawer>
      );
    }
    if (!data || !data.data || !Array.isArray(data.data.features)) {
      return (
        <MapCategoryDetailsDrawerLayout
          title="Buildings Data Viewer"
          open={open}
          onClose={onClose}
        >
          <Box className="flex flex-col h-full items-center justify-center p-8">
            <Typography variant="h6" className="text-gray-500 mb-2">
              No building data available
            </Typography>
          </Box>
        </MapCategoryDetailsDrawerLayout>
      );
    }
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        transitionDuration={400}
        SlideProps={{
          timeout: 400,
          easing: {
            enter: theme.transitions.easing.easeOut,
            exit: theme.transitions.easing.sharp,
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 480 },
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.95
            )} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
            backdropFilter: "blur(20px)",
            transition: theme.transitions.create(["transform", "opacity"], {
              duration: 400,
              easing: theme.transitions.easing.easeInOut,
            }),
          },
        }}
      >
        <Box className="flex flex-col h-full">
          {/* Header */}
          <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Box className="flex items-center justify-between mb-4">
              <Box className="flex items-center space-x-2">
                <Icon
                  icon="mdi:layers"
                  className="w-6 h-6"
                  style={{ color: categoryColor }}
                />
                <Typography
                  variant="h5"
                  className="font-bold"
                  style={{ color: categoryColor }}
                >
                  Buildings Data Viewer
                </Typography>
              </Box>
              <Tooltip arrow title="Close drawer">
                <IconButton
                  onClick={onClose}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(categoryColor, 0.12),
                    },
                  }}
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Stats Cards */}
            <Box className="grid grid-cols-3 gap-3 mb-4">
              <Card sx={{ backgroundColor: alpha(categoryColor, 0.08) }}>
                <CardContent className="p-3">
                  <Typography
                    variant="h6"
                    className="font-bold"
                    style={{ color: categoryColor }}
                  >
                    {data.data.features.length}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    Features
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ backgroundColor: alpha(categoryColor, 0.08) }}>
                <CardContent className="p-3">
                  <Typography
                    variant="h6"
                    className="font-bold"
                    style={{ color: categoryColor }}
                  >
                    {buildingTypes.length}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    Types
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ backgroundColor: alpha(categoryColor, 0.08) }}>
                <CardContent className="p-3">
                  <Typography
                    variant="h6"
                    className="font-bold"
                    style={{ color: categoryColor }}
                  >
                    {data.page ?? 0}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    Page
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Search and Filter */}
            <Box className="space-y-3">
              <TextField
                fullWidth
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        icon="mdi:magnify"
                        className="w-5 h-5"
                        style={{ color: categoryColor }}
                      />
                    </InputAdornment>
                  ),
                }}
                className="bg-white dark:bg-gray-800 rounded-lg"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: categoryColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: categoryColor,
                    },
                  },
                }}
              />

              <Box className="flex flex-wrap gap-2">
                <Chip
                  label="All"
                  onClick={() => setSelectedFilter("all")}
                  color={selectedFilter === "all" ? "secondary" : "default"}
                  icon={<Icon icon="mdi:filter" className="w-4 h-4" />}
                  className="transition-all duration-200"
                />
                {buildingTypes.map((type, i) => (
                  <Chip
                    key={type ?? i}
                    label={type}
                    onClick={() => setSelectedFilter(type ?? "")}
                    color={selectedFilter === type ? "secondary" : "default"}
                    className="transition-all duration-200 capitalize"
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box className="flex-1 overflow-y-auto p-4">
            {filteredFeatures.length === 0 ? (
              <Box className="text-center py-8">
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No Buildings found
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            ) : (
              <>
                <List className="space-y-2">
                  {filteredFeatures.map((feature, index) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      index={index}
                      categoryColor={categoryColor}
                      expandedFeatures={expandedFeatures}
                      toggleFeature={toggleFeature}
                      getBuildingIcon={getBuildingIcon}
                      formatCoordinates={formatCoordinates}
                      calculateArea={calculateArea}
                      onZoomToFeature={onZoomToFeature}
                      onClose={onClose}
                      isColorLight={isColorLight}
                    />
                  ))}
                </List>
                {/* Infinite scroll trigger */}
                <div ref={ref} />
                {isFetching && (
                  <Box className="flex justify-center py-4">
                    <LinearProgress style={{ width: 100 }} />
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Footer */}
          <Box
            className="p-4 border-t border-gray-200 dark:border-gray-700"
            sx={{ backgroundColor: alpha(categoryColor, 0.06) }}
          >
            <Typography
              variant="caption"
              className="text-gray-500 text-center block"
            >
              Showing {filteredFeatures.length} of {data.data.features.length}{" "}
              features
            </Typography>
          </Box>
        </Box>
      </Drawer>
    );
  }
);
BuildingDrawerDetails.displayName = "BuildingDrawerDetails";
export default BuildingDrawerDetails;
