import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {Album} from "./album.model";
import {AlbumService} from "./album.service";
import {MediaMatcher} from "@angular/cdk/layout";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @Input()
  albums: Album[];

  constructor(private albumService: AlbumService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  cover(album: Album): string {
    if (isNullOrUndefined(album)) {
      return "../assets/img/defaultAlbum.png";
    }
    return this.albumService.albumCoverUrl(album);
  }

  albumSelected(album: Album) {

  }
}
