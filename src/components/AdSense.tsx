import { Paper, PaperProps } from '@mui/material';
import { useEffect } from 'react';

interface Props {

}

export default function AdSense(_props: Props & PaperProps) {
  useEffect(() => {

  }, []);

  return <Paper
    // {...props}
    component='ins'
  />;
}