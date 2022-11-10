import theme from "@/styles/theme";
import { Stack, Typography } from "@mui/material";
import Rank from "./Rank";

interface Props {
  max: number;
  index: number;
  height: number;
  name: string;
  taps: number;
  trail: string;
}

export default function Row({ max, index, height, name, taps, trail }: Props) {
  return (
    <Stack style={{
      position: 'absolute',
      backgroundColor: '#eee',
      width: '100%',
      height: height,
      top: height * index,
      zIndex: 9999 - index,
      overflow: 'hidden',
      transition: theme.transitions.create('top', {
        duration: 500,
        easing: 'ease-out',
      }),
    }}>
      <Stack
        direction='row'
        paddingX={1}
      >
        <Stack
          flexGrow={1}
          direction='row'
          alignItems='center'
        >
          <Rank rank={index + 1} />
          <Typography
            marginLeft={1}
            fontWeight='bold'
          >
            {name}
          </Typography>
        </Stack>
        <Typography>
          {taps}
        </Typography>
      </Stack>
      <Stack
        flexGrow={1}
        direction='row'
        alignItems='center'
        width={`${max ? (taps / max * 100) : 100}%`}
      >
        <Stack
          flexGrow={1}
          width={0}
          direction='row'
          justifyContent='end'
        >
          {Array.from(Array(4).keys()).map((i) => (
            <img
              key={i}
              src={trail}
            />
          ))}
        </Stack>
        <img
          src='/assets/images/nyancat.gif'
          style={{
            marginLeft: '-16px',
            zIndex: 1,
          }}
        />
      </Stack>
    </Stack>
  );
}