import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Song, SongCollection} from "./song.model";
import {Observable} from "rxjs/index";
import {Paging} from "../shared/paging.model";
import {isNullOrUndefined} from "util";

@Injectable()
export class SongService {
  constructor(private http: HttpClient) {
  }

  getSongs(uri: string, paging?: Paging): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + uri + this.getPagingForUrl(paging));
  }

  getAllSongs(paging?: Paging): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/song" + this.getPagingForUrl(paging));
  }

  getAllSongsOfAlbum(id: string, paging?: Paging): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/album/" + id + "/songs" + this.getPagingForUrl(paging));
  }

  getAllSongsOfArtist(id: string, paging?: Paging): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/artist/" + id + "/songs" + this.getPagingForUrl(paging));
  }

  getAllSongsOfPlaylist(id: string, paging?: Paging): Observable<SongCollection> {
    return this.http.get<SongCollection>(environment.restserver + "/api/playlist/" + id + "/songs" + this.getPagingForUrl(paging));
  }

  getSong(id: string): Observable<Song> {
    return this.http.get<Song>(environment.restserver + "/api/song/" + id);
  }

  getPagingForUrl(paging?: Paging): string {
    let s = "";
    if (isNullOrUndefined(paging)) {
      return s;
    }
    if (!isNullOrUndefined(paging.sort)) {
      s += "sort=" + paging.sort;
      if (isNullOrUndefined(paging.dir)) {
        s += "&dir=asc";
      } else {
        s += "&dir=" + paging.dir;
      }
    }
    if (paging.size > 0) {
      if (s !== "") {
        s += "&";
      }
      s += "size=" + paging.size;
      if (paging.page > 0) {
        s += "&page=" + paging.page;
      }
    }
    if (s !== "") {
      s = "?" + s;
    }
    return s;
  }
}
