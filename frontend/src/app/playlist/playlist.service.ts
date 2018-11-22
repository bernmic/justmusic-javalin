import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from "../../environments/environment";
import {Playlist, PlaylistCollection} from "./playlist.model";

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<PlaylistCollection> {
    const headers = new HttpHeaders({
      'x-klaus': 'fred'
    });
    return this.http.get<PlaylistCollection>(environment.restserver + "/api/playlist", {headers: headers});
  }

  getStaticPlaylists(): Observable<PlaylistCollection> {
    return this.http.get<PlaylistCollection>(environment.restserver + "/api/playlist?kind=static");
  }

  getPlaylist(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(environment.restserver + "/api/playlist/" + id);
  }

  addSongsToPlaylist(playlistId: string, songIds: string[]): Observable<any> {
    return this.http.post(environment.restserver + "/api/playlist/" + playlistId + "/songs", songIds);
  }

  savePlaylist(playlist: Playlist): Observable<Playlist> {
    console.log("Save: " + playlist.playlistId + "=" + playlist.name);
    if (playlist.playlistId === null || playlist.playlistId === "") {
      return this.http.post<Playlist>(environment.restserver + "/api/playlist", playlist);
    } else {
      return this.http.put<Playlist>(environment.restserver + "/api/playlist", playlist);
    }
  }
  deletePlaylist(playlistId: string): Observable<number> {
    return this.http.delete<number>(environment.restserver + "/api/playlist/" + playlistId);
  }
}
