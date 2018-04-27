import {Album} from "../album/album.model";
import {Artist} from "../artist/artist.model";

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
    public vbr: boolean,
    public rating: number,
    public filedate: number
  ) {}
}
