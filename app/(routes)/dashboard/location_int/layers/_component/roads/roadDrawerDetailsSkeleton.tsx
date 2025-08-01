import { Icon } from "@iconify/react";
import { Box, Card, CardContent, IconButton, Skeleton } from "@mui/material";
import React from "react";

const RoadDrawerSkeleton: React.FC = () => {
  return (
    <Box className="flex flex-col h-full">
      {/* Header */}
      <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={150} height={30} />
          </Box>
          <IconButton>
            <Icon icon="mdi:close" className="w-6 h-6" />
          </IconButton>
        </Box>

        {/* Stats */}
        <Box className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-3">
              <Skeleton variant="text" width={30} />
              <Skeleton variant="text" width={60} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <Skeleton variant="text" width={30} />
              <Skeleton variant="text" width={60} />
            </CardContent>
          </Card>
        </Box>

        {/* Search */}
        <Skeleton
          variant="rectangular"
          height={40}
          className="rounded-lg mb-3"
        />

        {/* Filter Chips */}
        <Box className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={60 + i * 10}
              height={32}
            />
          ))}
        </Box>
      </Box>

      {/* List of Features */}
      <Box className="flex-1 overflow-y-auto p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <Box className="p-4 flex items-center gap-3">
              <Skeleton variant="circular" width={24} height={24} />
              <Box className="flex-1 space-y-1">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Box>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          </Card>
        ))}
      </Box>

      {/* Footer */}
      <Box className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <Skeleton variant="text" width="50%" />
        <Skeleton
          variant="rectangular"
          height={6}
          className="mt-2 rounded-full"
        />
      </Box>
    </Box>
  );
};

export default React.memo(RoadDrawerSkeleton);
