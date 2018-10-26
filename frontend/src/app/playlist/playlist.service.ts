import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from "../../environments/environment";
import {Playlist, PlaylistCollection} from "./playlist.model";
import {SongService} from "../song/song.service";
import {SongCollection} from "../song/song.model";

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient, private songService: SongService) {}

  getPlaylists(): Observable<PlaylistCollection> {
    const headers = new HttpHeaders({
      'x-klaus': 'fred'
    });
    return this.http.get<PlaylistCollection>(environment.restserver + "/api/playlist", {headers: headers});
  }

  getPlaylist(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(environment.restserver + "/api/playlist/" + id);
  }

  addSongsToPlaylist(playlistId: string, songIds: string[]): Observable<any> {
    return this.http.post(environment.restserver + "/api/playlist/" + playlistId + "/songs", songIds);
  }

  savePlaylist(playlist: Playlist) : Observable<Playlist> {
    console.log("Save: " + playlist.playlistId + "=" + playlist.name);
    let result: Observable<any>;
    if (playlist.playlistId === null || playlist.playlistId === "") {
      return this.http.post<Playlist>(environment.restserver + "/api/playlist", playlist);
    } else {
      return this.http.put<Playlist>(environment.restserver + "/api/playlist", playlist);
    }
  }
}
