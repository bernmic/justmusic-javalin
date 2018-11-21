import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Song, SongCollection} from "./song.model";
import {Observable} from "rxjs/index";
import {Paging} from "../shared/paging.model";
import {isNullOrUndefined} from "util";
import {BaseService} from "../shared/base.service";

@Injectable()
export class SongService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getSongs(uri: string, filter: string, paging?: Paging): Observable<SongCollection> {
    let parameter =  this.getPagingForUrl(paging);
    if (!isNullOrUndefined(filter) && filter !== "") {
      if (parameter === "") {
        parameter = "?filter=" + filter;
      } else {
        parameter += "&filter=" + filter;
      }
    }
    return this.http.get<SongCollection>(environment.restserver + uri + parameter);
  }

  getAllSongs(filter: string, paging?: Paging): Observable<SongCollection> {
    let parameter =  this.getPagingForUrl(paging);
    if (!isNullOrUndefined(filter) && filter !== "") {
      if (parameter === "") {
        parameter = "?filter=" + filter;
      } else {
        parameter += "&filter=" + filter;
      }
    }
    return this.http.get<SongCollection>(environment.restserver + "/api/song" + parameter);
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
}
