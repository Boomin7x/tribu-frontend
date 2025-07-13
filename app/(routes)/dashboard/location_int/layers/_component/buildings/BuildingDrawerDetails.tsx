/* eslint-disable react-hooks/rules-of-hooks */
import {
  alpha,
  Badge,
  Box,
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
import React, { FC, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { IBuildingApiResponse } from "../../_utils/types/buildings/buildings_types";

interface IBuildingDrawerDetails {
  open: boolean;
  onClose: () => void;
  data: IBuildingApiResponse;
}

const BuildingDrawerDetails: FC<IBuildingDrawerDetails> = ({
  data = fakeData,
  onClose,
  open,
}) => {
  console.log({ data });
  // Guard: Only proceed if data, data.data, and data.data.features are valid
  if (!data || !data.data || !Array.isArray(data.data.features)) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box className="flex flex-col h-full items-center justify-center p-8">
          <Typography variant="h6" className="text-gray-500 mb-2">
            No building data available
          </Typography>
        </Box>
      </Drawer>
    );
  }

  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(
    new Set()
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Get building icon based on type
  const getBuildingIcon = (building: string | null) => {
    switch (building) {
      case "school":
        return <Icon icon="mdi:school" className="text-blue-500 w-6 h-6" />;
      case "public":
        return (
          <Icon icon="mdi:office-building" className="text-green-500 w-6 h-6" />
        );
      case "office":
        return (
          <Icon icon="mdi:briefcase" className="text-purple-500 w-6 h-6" />
        );
      default:
        return <Icon icon="mdi:map-marker" className="text-gray-500 w-6 h-6" />;
    }
  };

  // Get building color theme
  const getBuildingColor = (building: string | null) => {
    switch (building) {
      case "school":
        return "primary";
      case "public":
        return "success";
      case "office":
        return "secondary";
      default:
        return "default";
    }
  };

  // Filter and search features
  const filteredFeatures = useMemo(() => {
    return data.data.features.filter((feature) => {
      const matchesSearch =
        searchTerm === "" ||
        feature.properties.building
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        feature.id.toString().includes(searchTerm);

      const matchesFilter =
        selectedFilter === "all" ||
        feature.properties.building === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [data.data.features, searchTerm, selectedFilter]);

  // Get unique building types for filtering
  const buildingTypes = useMemo(() => {
    const types = new Set(
      data.data.features.map((f) => f.properties.building).filter(Boolean)
    );
    return Array.from(types);
  }, [data.data.features]);

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

  // Calculate polygon area (simplified)
  const calculateArea = (coordinates: number[][][]) => {
    // Simplified area calculation for display purposes
    const polygon = coordinates[0];
    return polygon.length * 100; // Mock calculation
  };

  // Format coordinates for display
  const formatCoordinates = (coordinates: number[][][]) => {
    const polygon = coordinates[0];
    return `${polygon.length} points`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 480 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <Box className="flex flex-col h-full">
        {/* Header */}
        <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center space-x-2">
              <Icon icon="mdi:layers" className="text-blue-500 w-6 h-6" />
              <Typography
                variant="h5"
                className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                GeoData Viewer
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
          <Box className="grid grid-cols-3 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-3">
                <Typography variant="h6" className="font-bold text-blue-600">
                  {data.data.features.length}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Features
                </Typography>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-3">
                <Typography variant="h6" className="font-bold text-green-600">
                  {buildingTypes.length}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Types
                </Typography>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-3">
                <Typography variant="h6" className="font-bold text-purple-600">
                  {data.page}
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
              {buildingTypes.map((type, i) => (
                <Chip
                  key={type ?? i}
                  label={type}
                  onClick={() => setSelectedFilter(type ?? "")}
                  color={
                    selectedFilter === type ? getBuildingColor(type) : "default"
                  }
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
                    onClick={() => toggleFeature(feature.id)}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <ListItemIcon>
                      <Badge
                        badgeContent={index + 1}
                        color="primary"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        {getBuildingIcon(feature.properties.building)}
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box className="flex items-center justify-between">
                          <Typography
                            variant="subtitle1"
                            className="font-semibold"
                          >
                            {feature.properties.building || "Unknown"} #
                            {feature.id}
                          </Typography>
                          <Chip
                            label={feature.geometry.type}
                            size="small"
                            color="info"
                            className="ml-2"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" className="text-gray-600">
                          {formatCoordinates(feature.geometry.coordinates)}
                        </Typography>
                      }
                    />
                    <IconButton size="small">
                      {expandedFeatures.has(feature.id) ? (
                        <Icon icon="mdi:chevron-up" className="w-5 h-5" />
                      ) : (
                        <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                      )}
                    </IconButton>
                  </ListItemButton>

                  <Collapse
                    in={expandedFeatures.has(feature.id)}
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
                            {Object.entries(feature.properties).map(
                              ([key, value]) => (
                                <Box key={key} className="flex justify-between">
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
                                {feature.geometry.coordinates[0].length}
                              </span>
                            </Box>
                            <Box className="flex justify-between">
                              <span className="text-gray-600">Est. Area:</span>
                              <span className="font-medium">
                                {calculateArea(
                                  feature.geometry.coordinates
                                ).toLocaleString()}{" "}
                                m²
                              </span>
                            </Box>
                          </Box>
                        </Box>
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
            Showing {filteredFeatures.length} of {data.data.features.length}{" "}
            features
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(filteredFeatures.length / data.data.features.length) * 100}
            className="mt-2 rounded-full"
          />
        </Box>
      </Box>
    </Drawer>
  );
};

const fakeData = {
  message: "Successfully retrieved the data!",
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: 298435595,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [1075414.108028763, 454579.4272465311],
              [1075423.803956411, 454571.55928181764],
              [1075423.3920742953, 454570.81154619996],
              [1075434.891377694, 454561.1467848969],
              [1075440.1122618124, 454567.2067909963],
              [1075437.3626703897, 454569.5392796409],
              [1075443.7969369576, 454565.27607077645],
              [1075465.9495156254, 454599.61611233826],
              [1075456.8101854315, 454605.50871747767],
              [1075435.0026971851, 454571.3472373881],
              [1075418.6832598345, 454584.6837169585],
              [1075427.6110829965, 454580.5879108877],
              [1075444.6540970367, 454618.0863058794],
              [1075434.3570441382, 454622.6731642007],
              [1075417.625724672, 454585.0185240025],
              [1075418.4272250058, 454584.80647954124],
              [1075414.108028763, 454579.4272465311],
            ],
          ],
        },
        properties: {
          building: "school",
          amenity: null,
          shop: null,
          office: null,
          tourism: null,
          landuse: null,
        },
      },
      {
        type: "Feature",
        id: 298445816,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [1075409.8667561638, 454594.30383985536],
              [1075419.2398572885, 454589.7727841628],
              [1075423.5590535314, 454598.8906969597],
              [1075428.267867992, 454609.6603258765],
              [1075431.106515007, 454616.7805579331],
              [1075421.2102122756, 454620.4745970441],
              [1075415.7110294306, 454606.90374715993],
              [1075409.8667561638, 454594.30383985536],
            ],
          ],
        },
        properties: {
          building: "school",
          amenity: null,
          shop: null,
          office: null,
          tourism: null,
          landuse: null,
        },
      },
      {
        type: "Feature",
        id: 298441631,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [1075228.4048542217, 454668.0507095356],
              [1075245.9376740216, 454665.1044048618],
              [1075248.4423625646, 454681.84477361536],
              [1075230.84275107, 454685.07008502114],
              [1075228.4048542217, 454668.0507095356],
            ],
          ],
        },
        properties: {
          building: "public",
          amenity: null,
          shop: null,
          office: null,
          tourism: null,
          landuse: null,
        },
      },
    ],
  },
  limit: 10,
  page: 1,
};

export default BuildingDrawerDetails;
