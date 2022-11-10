import { Typography } from '@mui/material';

export default function Rank({ rank }: { rank: number }) {
  switch (rank) {
    case 1:
      return <img src='/assets/images/medals/gold.png' />
    case 2:
      return <img src='/assets/images/medals/silver.png' />
    case 3:
      return <img src='/assets/images/medals/bronze.png' />
    default:
      return <Typography fontWeight='bold'>#{rank}</Typography>;
  }
}