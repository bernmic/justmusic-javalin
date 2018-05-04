import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Song} from "./song.model";
import {Observable} from "rxjs/index";

@Injectable()
export class SongService {
  constructor(private http: HttpClient) {
  }

  getSongs(uri: string): Observable<Song[]> {
    return this.http.get<Song[]>(environment.restserver + uri);
  }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(environment.restserver + "/api/song");
  }

  getAllSongsOfAlbum(id: string): Observable<Song[]> {
    return this.http.get<Song[]>(environment.restserver + "/api/album/" + id + "/songs");
  }

  getAllSongsOfArtist(id: string): Observable<Song[]> {
    return this.http.get<Song[]>(environment.restserver + "/api/artist/" + id + "/songs");
  }

  getAllSongsOfPlaylist(id: string): Observable<Song[]> {
    return this.http.get<Song[]>(environment.restserver + "/api/playlist/" + id + "/songs");
  }

  getSong(id: string): Observable<Song> {
    return this.http.get<Song>(environment.restserver + "/api/song/" + id);
  }
}
