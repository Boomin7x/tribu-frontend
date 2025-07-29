import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";
import { FC } from "react";

const RoadDrawerDetailsSkeleton: FC = () => {
  return (
    <Box className="flex flex-col h-full">
      {/* Header Skeleton */}
      <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center space-x-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={150} height={32} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>

        {/* Stats Cards Skeleton */}
        <Box className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-3">
              <Skeleton variant="text" width={40} height={32} />
              <Skeleton variant="text" width={60} height={16} />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-3">
              <Skeleton variant="text" width={40} height={32} />
              <Skeleton variant="text" width={60} height={16} />
            </CardContent>
          </Card>
        </Box>

        {/* Search and Filter Skeleton */}
        <Box className="space-y-3">
          <Skeleton variant="rounded" width="100%" height={56} />
          <Box className="flex flex-wrap gap-2">
            <Skeleton variant="rounded" width={60} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={70} height={32} />
            <Skeleton variant="rounded" width={90} height={32} />
            <Skeleton variant="rounded" width={75} height={32} />
          </Box>
        </Box>
      </Box>

      {/* Content Skeleton */}
      <Box className="flex-1 overflow-y-auto p-4">
        <Stack spacing={2}>
          {/* Feature Cards Skeleton */}
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <Box className="p-4">
                <Box className="flex items-center space-x-3">
                  <Skeleton variant="circular" width={32} height={24} />
                  <Box className="flex-1">
                    <Box className="flex items-center justify-between mb-2">
                      <Skeleton variant="text" width={200} height={24} />
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                    <Skeleton variant="text" width={120} height={16} />
                  </Box>
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Footer Skeleton */}
      <Box className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <Skeleton variant="text" width={200} height={16} className="mx-auto" />
        <Skeleton variant="rounded" width="100%" height={8} className="mt-2" />
      </Box>
    </Box>
  );
};

export default RoadDrawerDetailsSkeleton;
