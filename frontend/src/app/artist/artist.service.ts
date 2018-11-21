import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SongService} from "../song/song.service";
import {Artist, ArtistCollection} from "./artist.model";
import {Album} from "../album/album.model";
import {Paging} from "../shared/paging.model";
import {isNullOrUndefined} from "util";
import {BaseService} from "../shared/base.service";

@Injectable()
export class ArtistService extends BaseService {
  constructor(private http: HttpClient, private songService: SongService) {
    super();
  }

  getAllArtists(filter: string, paging?: Paging): Observable<ArtistCollection> {
    let parameter =  this.getPagingForUrl(paging);
    if (!isNullOrUndefined(filter) && filter !== "") {
      if (parameter === "") {
        parameter = "?filter=" + filter;
      } else {
        parameter += "&filter=" + filter;
      }
    }
    return this.http.get<ArtistCollection>(environment.restserver + "/api/artist" + parameter);
  }

  getArtist(id: string): Observable<Artist> {
    return this.http.get<Artist>(environment.restserver + "/api/artist/" + id);
  }

  getAlbumsForArtist(id: string): Observable<Album[]> {
    return this.http.get<Album[]>(environment.restserver + "/api/artist/" + id + "/albums");
  }

  artistCoverUrl(artist: Artist): string {
    return environment.restserver + "/api/artist/" + artist.artistId + "/cover";
  }
}
