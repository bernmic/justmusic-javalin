import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Song} from "./song.model";

@Injectable()
export class SongService {
  constructor(private http: HttpClient) {
  }

  getSongs(uri: string): Observable<Song[]> {
    return this.http.get<Song[]>(environment.restserver + uri);
  }

  getSong(id: string): Observable<Song> {
    return this.http.get<Song>(environment.restserver + "/api/song/" + id);
  }
}
