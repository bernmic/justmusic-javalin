import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Song, SongCollection} from "./song.model";
import {Observable} from "rxjs/index";

@Injectable()
export class SongService {
  constructor(private http: HttpClient) {
  }

  getSongs(uri: string): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + uri);
  }

  getAllSongs(): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/song");
  }

  getAllSongsOfAlbum(id: string): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/album/" + id + "/songs");
  }

  getAllSongsOfArtist(id: string): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/artist/" + id + "/songs");
  }

  getAllSongsOfPlaylist(id: string): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/playlist/" + id + "/songs");
  }

  getSong(id: string): Observable<Song> {
    return this.http.get<Song>(environment.restserver + "/api/song/" + id);
  }
}
