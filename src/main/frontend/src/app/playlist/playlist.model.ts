import {Album} from "../album/album.model";
import {Paging} from "../shared/paging.model";

export class Playlist {
  constructor(public id: string, public name: string, public filename: string) {}
}

export class PlaylistCollection {
  constructor(public playlists: Playlist[], public paging: Paging) {}
}
