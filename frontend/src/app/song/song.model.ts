import {Album} from "../album/album.model";
import {Artist} from "../artist/artist.model";
import {Paging} from "../shared/paging.model";

export class Song {
  constructor(
    public songId: string,
    public title: string,
    public path: string,
    public duration: number,
    public bitrate: number,
    public sampleRate: number,
    public track: number,
    public album: Album,
    public artist: Artist,
    public genre: string,
    public added: number,
    public yearPublished: string,
    public cbrvbr: string,
    public rating: number,
    public filedate: number
  ) {}
}

export class SongCollection {
  constructor(public songs: Song[], public description, public paging: Paging, public total: number) {}
}
