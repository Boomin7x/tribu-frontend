import { Icon } from "@iconify/react";
import {
  alpha,
  Box,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

const MapCategoryDetailsDrawerLayout = React.memo<{
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  open: boolean;
}>(({ children, title, onClose, open }) => {
  const theme = useTheme();
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
      <Box className="flex items-center justify-between mb-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <Box className="flex items-center space-x-2">
          <Icon icon="mdi:layers" className="text-blue-500 w-6 h-6" />
          <Typography
            variant="h5"
            className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {title}
          </Typography>
        </Box>
        <Tooltip arrow title="Close drawer">
          <IconButton
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </IconButton>
        </Tooltip>
      </Box>
      {children}
    </Drawer>
  );
});

MapCategoryDetailsDrawerLayout.displayName = "MapCategoryDetailsDrawerLayout";

export default MapCategoryDetailsDrawerLayout;
