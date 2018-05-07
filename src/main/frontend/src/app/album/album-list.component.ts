import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Album} from "./album.model";
import {AlbumService} from "./album.service";
import {Sort} from "@angular/material";
import {MediaMatcher} from "@angular/cdk/layout";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-album',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  albums: Album[];

  constructor(private albumService: AlbumService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    console.log(media);
  }

  ngOnInit() {
    this.albumService.getAllAlbums().subscribe(albums => {
      this.albums = albums.albums;
    });
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
