import { Country, createCountry } from '@/libs/country';
import createFlag from '@/libs/createFlag';
import Player from '@/libs/player';
import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { NextApiHandler } from 'next';
import { Server } from 'socket.io';

let countries: Record<string, Country> | undefined;

const dataPath = `${process.cwd()}/public/data.json`;

async function loadData() {
  const result: typeof countries = {};
  for (const player of JSON.parse(readFileSync(dataPath).toString())) {
    if (!result[player.country_code]) {
      await createFlag(player.country_code);
      result[player.country_code] = await createCountry(player.country_code);
    }
    result[player.country_code].players[player.uid] = player;
  }
  return result;
}

setInterval(() => {
  if (countries) {
    const data = Object.values(countries)
      .map((country) => Object.values(country.players))
      .reduce((ret, cur) => [...(ret ?? []), ...cur]);
    writeFileSync(dataPath, JSON.stringify(data));
  }
}, 3000);

const createPlayer = async (country_code: string, uid: string) => {
  if (!countries) {
    countries = await loadData();
  }

  if (!countries[country_code]) {
    await createFlag(country_code);
    countries[country_code] = await createCountry(country_code);
  }

  const player = new Player(uid, country_code);
  countries[country_code].players[uid] = player;
  return player;
};

const findPlayer = async (uid: string) => {
  if (!countries) {
    countries = await loadData();
  }

  for (const country of Object.values(countries)) {
    for (const player of Object.values(country.players)) {
      if (player.uid === uid) {
        return player;
      }
    }
  }

  return null;
};

const initSocket = (io: Server) => {
  io.on('connection', async (socket) => {
    const uid = socket.handshake.auth.uid;

    if (!uid) {
      socket.disconnect();
    }

    let player = await findPlayer(uid);
    if (!player) {
      let country = 'ID';
      if (process.env.NODE_ENV === 'production') {
        const ip = socket.conn.remoteAddress;
        const { data } = await axios(`https://ipapi.co/${ip}/json/`);
        country = data.country_code;
      }
      player = await createPlayer(country, uid);
      socket.broadcast.emit('player', player);
    }

    socket.emit('connected', player, countries);

    socket.on('tap', (x, y) => {
      player!.taps++;
      socket.emit('tap', x, y, player);
      socket.broadcast.emit('tap', player);
    });
  });
};

const handler: NextApiHandler = (_, res) => {
  const socket: any = res.socket;
  if (!socket.server.io) {
    socket.server.io = new Server(socket.server);
    initSocket(socket.server.io);
  }
  res.end();
};

export default handler;
