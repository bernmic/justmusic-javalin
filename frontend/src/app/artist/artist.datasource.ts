import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Paging} from "../shared/paging.model";
import {catchError, finalize} from "rxjs/operators";
import {Artist, ArtistCollection} from "./artist.model";
import {ArtistService} from "./artist.service";

export class ArtistDataSource implements DataSource<Artist> {
  private artistsSubject = new BehaviorSubject<Artist[]>([]);
  public artistTotalSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public artists: Artist[] = [];

  public loading$ = this.loadingSubject.asObservable();

  constructor(private artistService: ArtistService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Artist[]> {
    return this.artistsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.artistsSubject.complete();
    this.artistTotalSubject.complete();
    this.loadingSubject.complete();
  }

  loadArtists(filter: string, paging: Paging) {
    this.loadingSubject.next(true);

    let artistsObservable: Observable<ArtistCollection>;

    artistsObservable = this.artistService.getAllArtists(filter, paging);
    artistsObservable
      .pipe(
        catchError(() => of(new ArtistCollection([], null, 0))),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(artistCollection => {
        this.artistTotalSubject.next(artistCollection.total);
        this.artistsSubject.next(artistCollection.artists);
        this.artists = artistCollection.artists;
      });
  }
}
