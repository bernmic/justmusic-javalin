import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {Song} from "../song/song.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SongService} from "../song/song.service";
import {Artist} from "./artist.model";

@Injectable()
export class ArtistService {
  constructor(private http: HttpClient, private songService: SongService) {
  }

  getAllArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(environment.restserver + "/api/artist");
  }

  getArtist(id: string): Observable<Artist> {
    return this.http.get<Artist>(environment.restserver + "/api/artist/" + id);
  }

  getSongs(id: string): Observable<Song[]> {
    return this.songService.getSongs("/api/artist/" + id + "/songs");
  }

  artistCoverUrl(artist: Artist): string {
    return environment.restserver + "/api/artist/" + artist.artistId + "/cover";
  }
}
