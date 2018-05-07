import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {SongCollection} from "../song/song.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Album, AlbumCollection} from "./album.model";
import {SongService} from "../song/song.service";

@Injectable()
export class AlbumService {
  constructor(private http: HttpClient, private songService: SongService) {
  }

  getAllAlbums(): Observable<AlbumCollection> {
    return this.http.get<AlbumCollection>(environment.restserver + "/api/album");
  }

  getAlbum(id: string): Observable<Album> {
    return this.http.get<Album>(environment.restserver + "/api/album/" + id);
  }

  getSongs(id: string): Observable<SongCollection> {
    return this.songService.getSongs("/api/album/" + id + "/songs");
  }

  albumCoverUrl(album: Album): string {
    return environment.restserver + "/api/album/" + album.albumId + "/cover";
  }
}
