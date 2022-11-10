import Player from '@/libs/player';
import { Box, BoxProps } from '@mui/material';
import { forwardRef } from 'react';
import Row from './Row';

interface Props {
  rowHeight: number,
  players: Player[],
}

const Local = forwardRef<HTMLDivElement, Props & BoxProps>(({ rowHeight, players, ...props }, ref) => {
  const max = players[0].taps;

  return (
    <Box
      {...props}
      ref={ref}
      height={rowHeight * players.length}
    >
      {players.map((player, i) => (
        <Row
          key={player.uid}
          max={max}
          index={i}
          height={rowHeight}
          name={player.name}
          taps={player.taps}
          trail={`/assets/images/trails/${player.country_code}.gif`}
        />
      ))
      }
    </Box>
  );
});

export default Local;
