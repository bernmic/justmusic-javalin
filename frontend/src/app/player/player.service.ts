import {Injectable} from "@angular/core";
import {Subject} from "rxjs/index";
import {Song} from "../song/song.model";
import {isNullOrUndefined} from "util";
import {environment} from "../../environments/environment";
import {AuthService} from "../security/auth.service";

@Injectable()
export class PlayerService {
  private playSource: Subject<Song> = new Subject<Song>();
  private listChange: Subject<Song[]> = new Subject<Song[]>();
  play$ = this.playSource.asObservable();
  listchange$ = this.listChange.asObservable();

  currentSong: Song;
  songlist: Song[] = [];

  constructor(private authService: AuthService) {}

  playSong(song: Song) {
    this.currentSong = song;
    if (this.songlist.indexOf(song) < 0) {
      this.songlist.push(song);
    }
    this.playSource.next(song);
    this.listChange.next(this.songlist);
  }

  addSong(song: Song) {
    this.songlist.push(song);
    this.listChange.next(this.songlist);
  }

  nextSong() {
    if (this.songlist.length > 0) {
      if (isNullOrUndefined(this.currentSong)) {
        this.playSong(this.songlist[0]);
      } else {
        const index = this.songlist.indexOf(this.currentSong) + 1;
        if (index < this.songlist.length) {
          this.playSong(this.songlist[index]);
        }
      }
    }
  }

  previousSong() {
    if (this.songlist.length > 0) {
      if (isNullOrUndefined(this.currentSong)) {
        this.playSong(this.songlist[0]);
      } else {
        const index = this.songlist.indexOf(this.currentSong) - 1;
        if (index >= 0) {
          this.playSong(this.songlist[index]);
        }
      }
    }
  }

  removeSong(song: Song) {
    const index = this.songlist.indexOf(song, 0);
    if (index >= 0) {
      this.songlist.splice(index, 1);
      this.listChange.next(this.songlist);
    }
  }

  songCoverUrl(song: Song): string {
    return environment.restserver + "/api/song/" + song.songId + "/cover?bearer=" + this.authService.getToken();
  }

  songStreamUrl(song: Song): string {
    return environment.restserver + "/api/song/" + song.songId + "/stream?bearer=" + this.authService.getToken();
  }
}
