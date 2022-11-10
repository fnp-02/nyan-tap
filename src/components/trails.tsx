import { Stack, StackProps } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props extends StackProps {
  cc: string;
}

export function FlagTrails({ cc, ...props }: Props) {
  const [c1, sc1] = useState(0);
  const [c2, sc2] = useState(false);

  useEffect(() => {
    const loop = setInterval(() => {
      sc1((p) => {
        if (p === 2) {
          return 0;
        }
        return p + 1;
      });
      sc2((p) => !p);
    }, 300);

    return (() => clearInterval(loop));
  }, []);

  const url = `https://flagcdn.com/w80/${cc.toLowerCase()}.jpg`;
  // const url = `https://flagcdn.com/w80/us.jpg`;

  return (
    <Stack
      {...props}
      direction='row'
    >
      {
        Array.from(Array(4).keys()).map(() => (
          Array.from(Array(6).keys()).map((i) => (
            <img
              key={i}
              src={url}
              style={{
                width: '16px',
                height: '31.8px',
                objectFit: 'cover',
                objectPosition: `${((i + c1) % 3) * 50}% 50%`,
                transform: `translateY(${((i % 2) ? 1 : -1) * (c2 ? 1 : -1) * 4}%)`,
              }}
            />
          ))
        ))
      }
    </Stack>
  );
}