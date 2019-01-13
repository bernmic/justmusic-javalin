import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {SongCollection} from "../song/song.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Album, AlbumCollection} from "./album.model";
import {SongService} from "../song/song.service";
import {AuthService} from "../security/auth.service";
import {Paging} from "../shared/paging.model";
import {isNullOrUndefined} from "util";
import {BaseService} from "../shared/base.service";
import {map} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class AlbumService extends BaseService {
  constructor(
    private http: HttpClient,
    private songService: SongService,
    private authService: AuthService,
    private sanitizer: DomSanitizer) {
    super();
  }

  getAllAlbums(filter: string, paging?: Paging): Observable<AlbumCollection> {
    let parameter = this.getPagingForUrl(paging);
    if (!isNullOrUndefined(filter) && filter !== "") {
      if (parameter === "") {
        parameter = "?filter=" + filter;
      } else {
        parameter += "&filter=" + filter;
      }
    }
    return this.http.get<AlbumCollection>(environment.restserver + "/api/album" + parameter);
  }

  getAlbum(id: string): Observable<Album> {
    return this.http.get<Album>(environment.restserver + "/api/album/" + id);
  }

  getCover(album: Album): any {
    return this.http.get(environment.restserver + "/api/album/" + album.albumId + "/cover", {
      responseType: 'blob'
    })
      .pipe(
        map((res: any) => {
          const urlCreator = window.URL;
          return this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(res));
        })
      );
  }

  albumCoverUrl(album: Album): string {
    return environment.restserver + "/api/album/" + album.albumId + "/cover?bearer=" + this.authService.getToken();
  }
}
