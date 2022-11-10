import { Country } from '@/libs/country';
import { Box, BoxProps } from '@mui/material';
import { forwardRef } from 'react';
import Row from './Row';

interface Props {
  rowHeight: number,
  countries: [Country, number][],
}

const Global = forwardRef<HTMLDivElement, Props & BoxProps>(({ rowHeight, countries, ...props }, ref) => {
  const max = countries[0][1];

  return (
    <Box
      {...props}
      ref={ref}
      height={rowHeight * countries.length}
    >
      {countries.map(([country, taps], i) => (
        <Row
          key={country.cca2}
          max={max}
          index={i}
          height={rowHeight}
          name={country.name.common}
          taps={taps}
          trail={`/assets/images/trails/${country.cca2}.gif`}
        />
      ))
      }
    </Box>
  );
});

export default Global;
