import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {ArtistService} from "./artist.service";
import {Artist} from "./artist.model";
import {Paging} from "../shared/paging.model";

export class ArtistNewDataSource extends DataSource<Artist> {
  private artists: Artist[];
  private dataStream = new BehaviorSubject<(Artist)[]>([]);

  constructor(private artistService: ArtistService) {
    super();
  }

  connect(): Observable<Artist[]> {
    this.artistService.getAllArtists("", new Paging(0, 0, "", "asc"))
      .subscribe((artistCollection) => {
        this.artists = artistCollection.artists;
        this.dataStream.next(this.artists);
      })

    return this.dataStream;
  }

  disconnect(): void {
  }
}
