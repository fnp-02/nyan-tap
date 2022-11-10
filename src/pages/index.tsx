import Global from '@/components/Global';
import Local from '@/components/Local';
import { Country } from '@/libs/country';
import Player from '@/libs/player';
import theme from '@/styles/theme';
import { KeyboardArrowUp, Save } from '@mui/icons-material';
import { Avatar, Box, ButtonBase, Collapse, Divider, IconButton, Paper, Slide, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Sound from 'react-sound';
import { connect, Socket } from 'socket.io-client';
import { v4 } from 'uuid';

declare global {
  var adsbygoogle: any[] | undefined;
}

const rowHeight = 80;

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [player, setPlayer] = useState<Player | null>(null);
  const [countries, setCountries] = useState<Record<string, Country>>({});

  const [isLocal, setIsLocal] = useState(false);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { }
    fetch('/api/socket').then(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (initialized) {
      let uid = localStorage.getItem('uid');
      if (!uid) {
        uid = v4();
        localStorage.setItem('uid', uid);
      }

      const io = connect({
        auth: { uid }
      });

      io.on('connected', (player, countries) => {
        setPlayer(player);
        setCountries(countries);
      });

      io.on('player', (player) => {
        setCountries((countries) => {
          const result = { ...countries };
          result[player.country_code].players[player.uid] = player;
          return result;
        });
      });

      io.on('tap', (x, _y, player) => {
        if (player) {
          setPlayer(player);
        } else {
          player = x;
        }
        setCountries((countries) => {
          const result = { ...countries };
          result[player.country_code].players[player.uid] = player;
          return result;
        });
      });

      setSocket(io);

      return (() => {
        io.disconnect();
      });
    }
  }, [initialized]);

  if (!socket || !player) return 'Loading...';

  const openProfile = () => {
    setName(player.name);
    setAvatar(player.avatar);
    setShowProfile(true);
  };
  const closeProfile = () => {
    setShowProfile(false);
  };
  const toggleProfile = () => {
    if (showProfile) {
      closeProfile();
    } else {
      openProfile();
    }
  }

  return (
    <Stack style={{
      backgroundColor: '#ddd',
      width: '100vw',
      height: '100vh',
    }}>
      <Sound
        loop
        url='/assets/sounds/bgm.mp3'
        playStatus='PLAYING'
      />
      <Stack
        direction='row'
        component={Paper}
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Box
          width='calc(50% - .5px)'
          paddingY={1.5}
          component={ButtonBase}
          onClick={() => setIsLocal(false)}
        >
          <Stack
            spacing={2}
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <Avatar
              alt='GLOBAL'
              src='/assets/images/globe.png'
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Typography variant='h6'>
              GLOBAL
            </Typography>
          </Stack>
        </Box>
        <Divider
          flexItem
          orientation='vertical'
          sx={{ marginY: 1 }}
        />
        <Box
          width='calc(50% - 0.5px)'
          paddingY={1.5}
          component={ButtonBase}
          onClick={() => setIsLocal(true)}
        >
          <Stack
            spacing={2}
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <Avatar
              alt={player.country_code}
              src={`https://flagcdn.com/w40/${player.country_code.toLowerCase()}.jpg`}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Typography variant='h6'>
              LOCAL
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Box
        flexGrow={1}
        height={0}
        overflow='hidden auto'
        position='relative'
        onClick={({ clientX, clientY }) => {
          socket.emit('tap', clientX, clientY);
        }}
      >
        <Slide
          appear={false}
          in={!isLocal}
          direction='right'
          unmountOnExit={true}
        >
          <Global
            position='absolute'
            top={0}
            left={0}
            width={1}
            rowHeight={rowHeight}
            countries={
              Object.values(countries)
                .map((country) => ([
                  country,
                  Object.values(country.players)
                    .map((player) => (player.taps))
                    .reduce((ret, cur) => (ret + cur)),
                ]))
            }
          />
        </Slide>
        <Slide
          in={isLocal}
          direction='left'
          unmountOnExit={true}
        >
          <Local
            position='absolute'
            top={0}
            left={0}
            width={1}
            rowHeight={rowHeight}
            players={
              Object.values(countries[player.country_code].players)
                .sort((a, b) => (b.taps - a.taps))
            }
          />
        </Slide>
      </Box>
      <Stack
        component={Paper}
        spacing={1}
        paddingTop={1}
        paddingX={2}
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Stack
          spacing={2}
          direction='row'
          alignItems='center'
          onClick={toggleProfile}
        >
          <Avatar
            alt={player.name}
            src={`https://avatars.dicebear.com/api/pixel-art-neutral/${player.avatar}.svg`}
          />
          <Box flexGrow={1}>
            <Typography fontWeight='bold'>
              {player.name}
            </Typography>
            <Typography>
              {player.taps}
            </Typography>
          </Box>
          <IconButton
            onClick={toggleProfile}
            sx={[
              {
                transform: 'rotateX(0deg)',
                transition: theme.transitions.create('transform'),
              },
              showProfile && { transform: 'rotateX(180deg)' },
            ]}
          >
            <KeyboardArrowUp />
          </IconButton>
        </Stack>
        <Divider flexItem />
        <Collapse in={showProfile}>
          <Stack
            spacing={2}
            paddingY={1}
            alignItems='center'
          >
            <Box
              position='relative'
              width='65%'
              paddingTop='65%'
            >
              <Avatar
                alt={player.name}
                src={`https://avatars.dicebear.com/api/pixel-art-neutral/${avatar}.svg`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
            <TextField
              variant='standard'
              name='name'
              value={name}
              onChange={({ target }) => setName(target.value)}
              style={{ alignSelf: 'stretch' }}
              inputProps={{
                style: {
                  textAlign: 'center',
                  fontSize: theme.typography.h5.fontSize,
                  fontWeight: 'bold',
                }
              }}
            />
            <IconButton
              style={{ alignSelf: 'end' }}
            >
              <Save />
            </IconButton>
          </Stack>
        </Collapse>
      </Stack>
      <Paper
        square
        sx={{
          '& .adsbygoogle': {
            display: 'block',
            width: '320px',
            height: '100px',

            '& @media(min-width: 500px)': {
              width: '468px',
              height: '60px',
            },

            '& @media(min-width: 800px)': {
              width: '728px',
              height: '90px',
            },
          }
        }}
      >
        <ins
          className='adsbygoogle'
          data-ad-client='ca-pub-9771140857713694'
          data-ad-slot='2920243664'
          data-adtest={process.env.NODE_ENV !== 'production' ? 'on' : 'off'}
        />
      </Paper>
    </Stack>
  );
}
