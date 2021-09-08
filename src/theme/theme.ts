import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  xs: "24em",
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
});

export const theme = extendTheme({ breakpoints });
