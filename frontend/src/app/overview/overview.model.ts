import {Song} from "../song/song.model";
import {Album} from "../album/album.model";

export class Info {
  constructor(
    public songCount: number,
    public albumCount: number,
    public artistCount: number,
    public playlistCount: number,
    public userCount: number,
    public songsRecentlyAdded: Song[],
    public songsRecentlyPlayed: Song[],
    public songsMostPlayed: Song[],
    public albumsRecentlyAdded: Album[]
  ) {}
}
