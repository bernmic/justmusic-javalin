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

export class Sync {
  constructor(
    public state: string,
    public last_sync_started: number,
    public last_sync_duration: number,
    public songs_found: number,
    public new_songs_added: number,
    public new_songs_problems: number,
    public dangling_songs_found: number,
    public problem_songs: any,
    public dangling_songs: any
  ) {}
}
