"use client";
import { createTheme, ThemeProvider } from "@mui/material";
// import colors from "../styles/colors.module.scss";
import { FC, ReactNode } from "react";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Outfit",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    primary: {
      main: "#0caf60",
    },
    secondary: {
      main: "#E0C2FF",
      light: "#ffffff",
      dark: "#f5f5f5",
      contrastText: "#47008F",
    },
  },
});

interface IMainThemeProvider {
  children: ReactNode;
}
const MainThemeProvider: FC<IMainThemeProvider> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MainThemeProvider;
