import { names, uniqueNamesGenerator } from 'unique-names-generator';

export default class Player {
  uid: string;
  name: string;
  avatar: string;
  country_code: string;
  taps: number = 0;

  constructor(uid: string, country_code: string) {
    this.uid = uid;
    this.name = uniqueNamesGenerator({
      dictionaries: [names, names],
      separator: ' ',
    });
    this.avatar = this.name;
    this.country_code = country_code;
  }
}
