import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {SongCollection} from "../song/song.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Album, AlbumCollection} from "./album.model";
import {SongService} from "../song/song.service";
import {AuthService} from "../security/auth.service";

@Injectable()
export class AlbumService {
  constructor(private http: HttpClient, private songService: SongService, private authService: AuthService) {
  }

  getAllAlbums(): Observable<AlbumCollection> {
    return this.http.get<AlbumCollection>(environment.restserver + "/api/album");
  }

  getAlbum(id: string): Observable<Album> {
    return this.http.get<Album>(environment.restserver + "/api/album/" + id);
  }

  albumCoverUrl(album: Album): string {
    return environment.restserver + "/api/album/" + album.albumId + "/cover?bearer=" + this.authService.getToken();
  }
}
