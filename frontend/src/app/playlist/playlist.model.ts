import {Album} from "../album/album.model";
import {Paging} from "../shared/paging.model";

export class Playlist {
  constructor(public playlistId: string, public name: string, public query: string) {}
}

export class PlaylistCollection {
  constructor(public playlists: Playlist[], public paging: Paging, public total: number) {}
}
