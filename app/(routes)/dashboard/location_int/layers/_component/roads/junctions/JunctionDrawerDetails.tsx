import React, { FC, useState } from "react";
import {
  Drawer,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Feature, FeatureCollection } from "geojson";

interface IJunctionDrawerDetails {
  open: boolean;
  onClose: () => void;
  data: FeatureCollection;
  onZoomToFeature?: (feature: Feature) => void;
}

const JunctionDrawerDetails: FC<IJunctionDrawerDetails> = ({
  open,
  onClose,
  data,
  onZoomToFeature,
}) => {
  const theme = useTheme();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(
    new Set()
  );

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
  const formatCoordinates = (coordinates: number[]) => {
    return `Lng: ${coordinates[0]?.toFixed(5)}, Lat: ${coordinates[1]?.toFixed(
      5
    )}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <Box className="flex flex-col h-full">
        {/* Header */}
        <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center space-x-2">
              <Icon
                icon="mdi:vector-point"
                className="text-orange-500 w-6 h-6"
              />
              <Typography variant="h5" className="font-bold">
                Junctions
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
        </Box>

        {/* Content */}
        <Box className="flex-1 overflow-y-auto p-4">
          {data.features.length === 0 ? (
            <Box className="text-center py-8">
              <Typography variant="h6" className="text-gray-500 mb-2">
                No junctions found
              </Typography>
            </Box>
          ) : (
            <List className="space-y-2">
              {data.features.map((feature, index) => (
                <Card
                  key={feature.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <ListItemButton
                    onClick={() => toggleFeature(feature.id as number)}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <ListItemIcon>
                      <Chip
                        label={index + 1}
                        color="primary"
                        size="small"
                        className="w-6 h-6"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box className="flex items-center justify-between">
                          <Typography
                            variant="subtitle1"
                            className="font-semibold"
                          >
                            {feature.properties?.junction_type_description ||
                              "Junction"}{" "}
                            #{feature.id}
                          </Typography>
                          <Chip
                            label={feature.properties?.junction_type_code}
                            size="small"
                            color="info"
                            className="ml-2 capitalize"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" className="text-gray-600">
                          {formatCoordinates(
                            (feature.geometry as { coordinates: number[] })
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
                          <Box className="grid grid-cols-1  text-sm">
                            {Object.entries(feature.properties ?? {}).map(
                              ([key, value]) => (
                                <Box
                                  key={key}
                                  className="flex w-full border-x justify-between border-b first:border-t"
                                >
                                  <span className="text-gray-600 p-2 bg-gray-100 w-2/5 shrink-0 break-words capitalize">
                                    {key}:
                                  </span>
                                  <span className="font-medium w-3/5 p-2 shrink-0">
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : value || "null"}
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
                              <span className="text-gray-600">
                                Coordinates:
                              </span>
                              <span className="font-medium">
                                {formatCoordinates(
                                  (
                                    feature.geometry as {
                                      coordinates: number[];
                                    }
                                  ).coordinates
                                )}
                              </span>
                            </Box>
                          </Box>
                        </Box>
                        {onZoomToFeature && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                              onZoomToFeature(feature);
                              onClose();
                            }}
                            className="mt-2"
                          >
                            Zoom to on Map
                          </Button>
                        )}
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
            Showing {data.features.length} junctions
          </Typography>
          <LinearProgress
            variant="determinate"
            value={100}
            className="mt-2 rounded-full"
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default JunctionDrawerDetails;
