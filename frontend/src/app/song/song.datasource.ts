import {DataSource} from "@angular/cdk/table";
import {Song, SongCollection} from "./song.model";
import {CollectionViewer} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {SongService} from "./song.service";
import {Paging} from "../shared/paging.model";
import {catchError, finalize} from "rxjs/operators";

export class SongDataSource implements DataSource<Song> {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songTotalSubject = new BehaviorSubject<number>(0);
  public songDescriptionSubject = new BehaviorSubject<string>("");
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public songs: Song[] = [];

  public loading$ = this.loadingSubject.asObservable();

  constructor(private songService: SongService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Song[]> {
    return this.songsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.songsSubject.complete();
    this.songTotalSubject.complete();
    this.songDescriptionSubject.complete();
    this.loadingSubject.complete();
  }

  loadSongs(kind: string, id: string, filter: string, paging: Paging) {
    this.loadingSubject.next(true);

    let songsObservable: Observable<SongCollection>;

    if (kind === "") {
      songsObservable = this.songService.getAllSongs(filter, paging);
    } else if (kind === "album") {
      songsObservable = this.songService.getAllSongsOfAlbum(id, paging);
    } else if (kind === "artist") {
      songsObservable = this.songService.getAllSongsOfArtist(id, paging);
    } else if (kind === "playlist") {
      songsObservable = this.songService.getAllSongsOfPlaylist(id, paging);
    }
    songsObservable
      .pipe(
        catchError(() => of(new SongCollection([], "", null, 0))),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(songCollection => {
        this.songTotalSubject.next(songCollection.total);
        this.songDescriptionSubject.next(songCollection.description);
        this.songsSubject.next(songCollection.songs);
        this.songs = songCollection.songs;
      });
  }
}
