import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from "../../environments/environment";
import {Playlist} from "./playlist.model";
import {SongService} from "../song/song.service";
import {Song} from "../song/song.model";

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient, private songService: SongService) {}

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(environment.restserver + "/api/playlist");
  }

  getPlaylist(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(environment.restserver + "/api/playlist/" + id);
  }

  getSongs(id: string): Observable<Song[]> {
    return this.songService.getSongs("/api/playlist/" + id + "/songs");
  }
}
