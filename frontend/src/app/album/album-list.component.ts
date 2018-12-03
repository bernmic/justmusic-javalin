import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Album} from "./album.model";
import {AlbumService} from "./album.service";
import {MediaMatcher} from "@angular/cdk/layout";
import {isNullOrUndefined} from "util";
import {MatPaginator, PageEvent} from "@angular/material";
import {Paging} from "../shared/paging.model";
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  pageSize = 12;
  pageSizeOptions = [6, 12, 24, 48];
  total = 0;
  pageIndex = 0;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  albums: Album[];

  constructor(private albumService: AlbumService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.fetchAlbums("", new Paging(0, this.pageSize, "title", "asc"));
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe($event => {
      console.log($event.pageIndex);
      this.fetchAlbums("", new Paging($event.pageIndex, $event.pageSize, "title", "asc"));
    });

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.fetchAlbums(this.input.nativeElement.value, new Paging(0, this.pageSize, "title", "asc"));
        })
      )
      .subscribe();
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

  fetchAlbums(filter: string, paging: Paging) {
    this.albumService.getAllAlbums(filter, paging).subscribe(albums => {
      this.albums = albums.albums;
      this.total = albums.total;
    });
  }
}
