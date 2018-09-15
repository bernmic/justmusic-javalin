import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {SongCollection} from "../song/song.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SongService} from "../song/song.service";
import {Artist, ArtistCollection} from "./artist.model";

@Injectable()
export class ArtistService {
  constructor(private http: HttpClient, private songService: SongService) {
  }

  getAllArtists(): Observable<ArtistCollection> {
    return this.http.get<ArtistCollection>(environment.restserver + "/api/artist");
  }

  getArtist(id: string): Observable<Artist> {
    return this.http.get<Artist>(environment.restserver + "/api/artist/" + id);
  }

  artistCoverUrl(artist: Artist): string {
    return environment.restserver + "/api/artist/" + artist.artistId + "/cover";
  }
}
