import React, { FC, useMemo, useState } from "react";
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
import RoadDrawerDetailsSkeleton from "./roadDrawerDetailsSkeleton";

// RoadDrawerDetails component
interface IRoadDrawerDetails {
  open: boolean;
  onClose: () => void;
  data: FeatureCollection;
  onZoomToFeature?: (feature: Feature) => void;
  isLoading: boolean;
}
const RoadDrawerDetails: FC<IRoadDrawerDetails> = ({
  open,
  onClose,
  data,
  onZoomToFeature,
  isLoading,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(
    new Set()
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Get unique road types for filtering
  const roadTypes = useMemo(() => {
    const types = new Set(
      data.features.map((f) => f.properties?.highway).filter(Boolean)
    );
    return Array.from(types);
  }, [data.features]);

  // Filter and search features
  const filteredFeatures = useMemo(() => {
    return data.features.filter((feature) => {
      const matchesSearch =
        searchTerm === "" ||
        feature.properties?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        feature.id?.toString().includes(searchTerm);
      const matchesFilter =
        selectedFilter === "all" ||
        feature.properties?.highway === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [data.features, searchTerm, selectedFilter]);

  // Toggle feature expansion
  const toggleFeature = (featureId: number) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  // Format coordinates for display
  const formatCoordinates = (coordinates: number[][]) => {
    return `${coordinates.length} points`;
  };

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
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backdropFilter: "blur(20px)",
          transition: theme.transitions.create(["transform", "opacity"], {
            duration: 400,
            easing: theme.transitions.easing.easeInOut,
          }),
        },
      }}
    >
      {(() => {
        if (isLoading) {
          return <RoadDrawerDetailsSkeleton />;
        }
        return (
          <Box className="flex flex-col h-full">
            {/* Header */}
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
                    onClick={onClose}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Icon icon="mdi:close" className="w-6 h-6" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Stats Cards */}
              <Box className="grid grid-cols-2 gap-3 mb-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <CardContent className="p-3">
                    <Typography
                      variant="h6"
                      className="font-bold text-blue-600"
                    >
                      {data.features.length}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Features
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <CardContent className="p-3">
                    <Typography
                      variant="h6"
                      className="font-bold text-green-600"
                    >
                      {roadTypes.length}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Types
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
                          className="text-gray-400 w-5 h-5"
                        />
                      </InputAdornment>
                    ),
                  }}
                  className="bg-white dark:bg-gray-800 rounded-lg"
                />
                <Box className="flex flex-wrap gap-2">
                  <Chip
                    label="All"
                    onClick={() => setSelectedFilter("all")}
                    color={selectedFilter === "all" ? "primary" : "default"}
                    icon={<Icon icon="mdi:filter" className="w-4 h-4" />}
                    className="transition-all duration-200"
                  />
                  {roadTypes.map((type, i) => (
                    <Chip
                      key={type ?? i}
                      label={type}
                      onClick={() => setSelectedFilter(type ?? "")}
                      color={selectedFilter === type ? "primary" : "default"}
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
                    No features found
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    Try adjusting your search or filter criteria
                  </Typography>
                </Box>
              ) : (
                <List className="space-y-2">
                  {filteredFeatures.map((feature, index) => (
                    <Card
                      key={feature.id}
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <ListItemButton
                        onClick={() => toggleFeature(feature?.id as number)}
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
                              border: `1px solid ${
                                ROAD_CATEGORY_COLORS[
                                  feature.properties?.highway
                                ] || "#ccc"
                              }`,
                              backgroundColor:
                                ROAD_CATEGORY_COLORS[
                                  feature.properties?.highway
                                ] || undefined,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box className="flex items-center justify-between">
                              <Typography
                                variant="subtitle1"
                                className="font-semibold"
                              >
                                {feature.properties?.name || "Unnamed Road"} #
                                {feature.id}
                              </Typography>
                              <Chip
                                label={feature.properties?.highway}
                                size="small"
                                className="ml-2 capitalize"
                                sx={{
                                  backgroundColor:
                                    ROAD_CATEGORY_COLORS[
                                      feature.properties?.highway
                                    ] || undefined,
                                  color: "#fff",
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {formatCoordinates(
                                (
                                  feature.geometry as {
                                    type: string;
                                    coordinates: number[][];
                                  }
                                ).coordinates
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
                        <CardContent className="bg-gray-50 dark:bg-gray-800/30">
                          <Stack spacing={2}>
                            {/* Properties */}
                            <Box>
                              <Typography
                                variant="subtitle2"
                                className="font-semibold mb-2 flex items-center"
                              >
                                <Icon
                                  icon="mdi:information"
                                  className="w-4 h-4 mr-1"
                                />
                                Properties
                              </Typography>
                              <Box className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(feature.properties ?? {}).map(
                                  ([key, value]) => (
                                    <Box
                                      key={key}
                                      className="flex justify-between"
                                    >
                                      <span className="text-gray-600 capitalize">
                                        {key}:
                                      </span>
                                      <span className="font-medium">
                                        {value || "null"}
                                      </span>
                                    </Box>
                                  )
                                )}
                              </Box>
                            </Box>
                            {/* Geometry Info */}
                            <Box>
                              <Typography
                                variant="subtitle2"
                                className="font-semibold mb-2 flex items-center"
                              >
                                <Icon
                                  icon="mdi:map-marker"
                                  className="w-4 h-4 mr-1"
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
                                      (
                                        feature.geometry as {
                                          type: string;
                                          coordinates: number[][];
                                        }
                                      ).coordinates.length
                                    }
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                if (onZoomToFeature) {
                                  onZoomToFeature(feature as Feature);
                                  onClose();
                                }
                              }}
                              className="mt-2"
                              sx={{
                                backgroundColor:
                                  ROAD_CATEGORY_COLORS[
                                    feature.properties?.highway
                                  ] || undefined,
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor:
                                    ROAD_CATEGORY_COLORS[
                                      feature.properties?.highway
                                    ] || undefined,
                                },
                              }}
                            >
                              Zoom to on Map
                            </Button>
                          </Stack>
                        </CardContent>
                      </Collapse>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
            {/* Footer */}
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
                value={(filteredFeatures.length / data.features.length) * 100}
                className="mt-2 rounded-full"
              />
            </Box>
          </Box>
        );
      })()}
    </Drawer>
  );
};

export default RoadDrawerDetails;
