import {Song} from "../song/song.model";

export class Info {
  constructor(
    public songCount: number,
    public albumCount: number,
    public artistCount: number,
    public playlistCount: number,
    public userCount: number,
    public songsRecentlyAdded: Song[]
  ) {}
}
