import {Artist, ArtistCollection} from "./artist.model";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {ArtistService} from "./artist.service";
import {Paging} from "../shared/paging.model";
import {catchError, finalize} from "rxjs/operators";

export class ArtistDatasource extends DataSource<(Artist | undefined)> {
  private artistsSubject = new BehaviorSubject<Artist[]>([]);
  public artistTotalSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private subscription = new Subscription();

  private dataStream = new BehaviorSubject<Artist[]>([]);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private artistService: ArtistService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Artist[]> {
    console.log("CONNECT");
    collectionViewer.viewChange.subscribe( range => {
      this.fetchArtists(range.start, range.end);
    });
    this.fetchArtists(0, 1);
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log("DISCONNECT");
    this.artistsSubject.complete();
    this.artistTotalSubject.complete();
    this.loadingSubject.complete();
  }

  fetchArtists(start: number, end: number) {
    console.log("" + start + ", " + end);
    var artist = Array.from<Artist>({length: 50});
    this.dataStream.next(artist);
  }
}
