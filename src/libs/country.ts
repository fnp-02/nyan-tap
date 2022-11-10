import Player from './player';

export class CountryClass {
  players: Record<string, Player> = {};
}

export interface CountryData {
  name: {
    common: string,
    official: string,
    nativeName: {
      ind: {
        official: string,
        common: string
      }
    }
  },
  tld: string[],
  cca2: string,
  ccn3: string,
  cca3: string,
  cioc: string,
  independent: true,
  status: string,
  unMember: true,
  currencies: {
    IDR: {
      name: string,
      symbol: string
    }
  },
  idd: {
    root: string,
    suffixes: string[]
  },
  capital: string[],
  altSpellings: string[],
  region: string,
  subregion: string,
  languages: {
    ind: string
  },
  translations: {
    ara: {
      official: string,
      common: string
    },
    bre: {
      official: string,
      common: string
    },
    ces: {
      official: string,
      common: string
    },
    cym: {
      official: string,
      common: string
    },
    deu: {
      official: string,
      common: string
    },
    est: {
      official: string,
      common: string
    },
    fin: {
      official: string,
      common: string
    },
    fra: {
      official: string,
      common: string
    },
    hrv: {
      official: string,
      common: string
    },
    hun: {
      official: string,
      common: string
    },
    ita: {
      official: string,
      common: string
    },
    jpn: {
      official: string,
      common: string
    },
    kor: {
      official: string,
      common: string
    },
    nld: {
      official: string,
      common: string
    },
    per: {
      official: string,
      common: string
    },
    pol: {
      official: string,
      common: string
    },
    por: {
      official: string,
      common: string
    },
    rus: {
      official: string,
      common: string
    },
    slk: {
      official: string,
      common: string
    },
    spa: {
      official: string,
      common: string
    },
    swe: {
      official: string,
      common: string
    },
    tur: {
      official: string,
      common: string
    },
    urd: {
      official: string,
      common: string
    },
    zho: {
      official: string,
      common: string
    }
  },
  latlng: [number, number],
  landlocked: false,
  borders: string[],
  area: number,
  demonyms: {
    eng: {
      f: string,
      m: string
    },
    fra: {
      f: string,
      m: string
    }
  },
  flag: string,
  maps: {
    googleMaps: string,
    openStreetMaps: string
  },
  population: number,
  gini: Record<number, number>,
  fifa: string,
  car: {
    signs: string[],
    side: string
  },
  timezones: string[],
  continents: string[],
  flags: {
    png: string,
    svg: string
  },
  coatOfArms: {
    png: string,
    svg: string
  },
  startOfWeek: string,
  capitalInfo: {
    latlng: [number, number]
  },
  postalCode: {
    format: string,
    regex: string
  }
}

export async function createCountry(code: string) {
  const data: CountryData = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
    .then((response) => response.json()).then(([data]) => data);
  return Object.assign(new CountryClass(), data);
}

export type Country = Awaited<ReturnType<typeof createCountry>>;
