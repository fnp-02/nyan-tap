import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";

interface Props {
  height: number;
}

const Rows = forwardRef<HTMLDivElement, Props & BoxProps>((props, ref) => (
  <Box
    {...props}
    ref={ref}
  />
));

export default Rows;
