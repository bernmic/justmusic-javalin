import {Song} from "../song/song.model";
import {Album} from "../album/album.model";
import {Artist} from "../artist/artist.model";

export class SearchResult {
  constructor(public query: string, public songs: Song[], public albums: Album[], public artists: Artist[], public limited: boolean) {}
}
