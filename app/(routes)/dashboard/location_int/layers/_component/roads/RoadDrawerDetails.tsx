import React, { FC, useMemo, useState, useCallback, memo } from "react";
import {
  Drawer,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
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
  Button,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Feature, FeatureCollection } from "geojson";
import { ROAD_CATEGORY_COLORS } from "@/app/_hooks/useRoadsUtils";
import { useDebounce } from "@/app/_hooks/useDebounce";
import RoadDrawerSkeleton from "./roadDrawerDetailsSkeleton";

interface IRoadDrawerDetails {
  open: boolean;
  onClose: () => void;
  data: FeatureCollection;
  onZoomToFeature?: (feature: Feature) => void;
  isLoading?: boolean;
}

const FeatureItem = memo<{
  feature: Feature;
  index: number;
  isExpanded: boolean;
  onToggle: (featureId: number) => void;
  onZoomToFeature?: (feature: Feature) => void;
}>(({ feature, index, isExpanded, onToggle, onZoomToFeature }) => {
  const featureId = feature.properties?.ogc_fid as number;
  const highway = feature.properties?.highway;
  const name = feature.properties?.name || "Unnamed Road";
  const coordinates = (
    feature.geometry as { type: string; coordinates: number[][] }
  ).coordinates;

  const handleToggle = useCallback(() => {
    onToggle(featureId);
  }, [onToggle, featureId]);

  const handleZoomToFeature = useCallback(() => {
    if (onZoomToFeature) {
      onZoomToFeature(feature);
    }
  }, [onZoomToFeature, feature]);

  const roadColor = ROAD_CATEGORY_COLORS[highway] || "#ccc";
  const pointCount = coordinates.length;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <ListItemButton
        onClick={handleToggle}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <ListItemIcon>
          <Chip
            label={index + 1}
            color="primary"
            size="small"
            className="w-fit h-6"
            sx={{
              color: "white",
              border: `1px solid ${roadColor}`,
              backgroundColor: roadColor,
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box className="flex items-center justify-between">
              <Typography variant="subtitle1" className="font-semibold">
                {name} #{featureId}
              </Typography>
              <Chip
                label={highway}
                size="small"
                className="ml-2 capitalize"
                sx={{
                  backgroundColor: roadColor,
                  color: "#fff",
                }}
              />
            </Box>
          }
          secondary={
            <Typography variant="body2" className="text-gray-600">
              {pointCount} points
            </Typography>
          }
        />
        <IconButton size="small">
          <Icon
            icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="w-5 h-5"
          />
        </IconButton>
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto">
        <Divider />
        <CardContent className="bg-gray-50 dark:bg-gray-800/30">
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="subtitle2"
                className="font-semibold mb-2 flex items-center"
              >
                <Icon icon="mdi:information" className="w-4 h-4 mr-1" />
                Properties
              </Typography>
              <Box className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(feature.properties ?? {}).map(
                  ([key, value]) => (
                    <Box key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium">{value || "null"}</span>
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
                <Icon icon="mdi:map-marker" className="w-4 h-4 mr-1" />
                Geometry
              </Typography>
              <Box className="space-y-1 text-sm">
                <Box className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{feature.geometry.type}</span>
                </Box>
                <Box className="flex justify-between">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-medium">{pointCount}</span>
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleZoomToFeature}
              className="mt-2"
              sx={{
                backgroundColor: roadColor,
                color: "#fff",
                "&:hover": {
                  backgroundColor: roadColor,
                },
              }}
            >
              Zoom to on Map
            </Button>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
});

FeatureItem.displayName = "FeatureItem";

const StatsCards = memo<{ featureCount: number; roadTypeCount: number }>(
  ({ featureCount, roadTypeCount }) => (
    <Box className="grid grid-cols-2 gap-3 mb-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardContent className="p-3">
          <Typography variant="h6" className="font-bold text-blue-600">
            {featureCount}
          </Typography>
          <Typography variant="caption" className="text-gray-600">
            Features
          </Typography>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardContent className="p-3">
          <Typography variant="h6" className="font-bold text-green-600">
            {roadTypeCount}
          </Typography>
          <Typography variant="caption" className="text-gray-600">
            Types
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
);

StatsCards.displayName = "StatsCards";

const FilterChips = memo<{
  roadTypes: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}>(({ roadTypes, selectedFilter, onFilterChange }) => (
  <Box className="flex flex-wrap gap-2">
    <Chip
      label="All"
      onClick={() => onFilterChange("all")}
      color={selectedFilter === "all" ? "primary" : "default"}
      icon={<Icon icon="mdi:filter" className="w-4 h-4" />}
      className="transition-all duration-200"
    />
    {roadTypes.map((type, i) => (
      <Chip
        key={type ?? i}
        label={type}
        onClick={() => onFilterChange(type ?? "")}
        color={selectedFilter === type ? "primary" : "default"}
        className="transition-all duration-200 capitalize"
      />
    ))}
  </Box>
));

FilterChips.displayName = "FilterChips";

const RoadDrawerDetails: FC<IRoadDrawerDetails> = ({
  open,
  onClose,
  data,
  onZoomToFeature,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(
    new Set()
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [debouncedSearchTerm] = useDebounce<string>(searchTerm, 300);

  const roadTypes = useMemo(() => {
    const types = new Set(
      data.features.map((f) => f.properties?.highway).filter(Boolean)
    );
    return Array.from(types);
  }, [data.features]);

  const searchIndex = useMemo(() => {
    return data.features.map((feature, index) => ({
      feature,
      index,
      searchText: `${feature.properties?.name || ""} ${
        feature.id || ""
      }`.toLowerCase(),
      highway: feature.properties?.highway,
    }));
  }, [data.features]);

  const filteredFeatures = useMemo(() => {
    if (!debouncedSearchTerm && selectedFilter === "all") {
      return data.features;
    }

    return searchIndex
      .filter(({ searchText, highway }) => {
        const matchesSearch =
          !debouncedSearchTerm ||
          searchText.includes(debouncedSearchTerm.toLowerCase());
        const matchesFilter =
          selectedFilter === "all" || highway === selectedFilter;
        return matchesSearch && matchesFilter;
      })
      .map(({ feature }) => feature);
  }, [searchIndex, debouncedSearchTerm, selectedFilter]);

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

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleZoomToFeature = useCallback(
    (feature: Feature) => {
      if (onZoomToFeature) {
        onZoomToFeature(feature);
        onClose();
      }
    },
    [onZoomToFeature, onClose]
  );

  const progressValue = useMemo(() => {
    return (filteredFeatures.length / data.features.length) * 100;
  }, [filteredFeatures.length, data.features.length]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
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
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backdropFilter: "blur(20px)",
          transition: theme.transitions.create(["transform", "opacity"], {
            duration: 400,
            easing: theme.transitions.easing.easeInOut,
          }),
        },
      }}
    >
      {isLoading ? (
        <RoadDrawerSkeleton />
      ) : (
        <Box className="flex flex-col h-full">
          <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Box className="flex items-center justify-between mb-4">
              <Box className="flex items-center space-x-2">
                <Icon
                  icon="mdi:road-variant"
                  className="text-blue-500 w-6 h-6"
                />
                <Typography
                  variant="h5"
                  className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Road Data Viewer
                </Typography>
              </Box>
              <Tooltip title="Close drawer">
                <IconButton
                  onClick={handleClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </IconButton>
              </Tooltip>
            </Box>

            <StatsCards
              featureCount={data.features.length}
              roadTypeCount={roadTypes.length}
            />

            <Box className="space-y-3">
              <TextField
                fullWidth
                placeholder="Search features..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        icon="mdi:magnify"
                        className="text-gray-400 w-5 h-5"
                      />
                    </InputAdornment>
                  ),
                }}
                className="bg-white dark:bg-gray-800 rounded-lg"
              />
              <FilterChips
                roadTypes={roadTypes}
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
              />
            </Box>
          </Box>

          <Box className="flex-1 overflow-y-auto p-4">
            {filteredFeatures.length === 0 ? (
              <Box className="text-center py-8">
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No Roads found
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            ) : (
              <List className="space-y-2">
                {filteredFeatures.map((feature, index) => (
                  <FeatureItem
                    key={feature.properties?.ogc_fid}
                    feature={feature}
                    index={index}
                    isExpanded={expandedFeatures.has(
                      feature.properties?.ogc_fid as number
                    )}
                    onToggle={toggleFeature}
                    onZoomToFeature={handleZoomToFeature}
                  />
                ))}
              </List>
            )}
          </Box>

          <Box className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <Typography
              variant="caption"
              className="text-gray-500 text-center block"
            >
              Showing {filteredFeatures.length} of {data.features.length}{" "}
              features
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              className="mt-2 rounded-full"
            />
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default memo(RoadDrawerDetails);
