import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlbumService} from "./album.service";
import {Paging} from "../shared/paging.model";
import {Album} from "./album.model";
import {isNullOrUndefined} from "util";
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {MatPaginator} from "@angular/material";
import {MediaObserver} from "@angular/flex-layout";

@Component({
  selector: 'app-album-list-new',
  templateUrl: './album-list-new.component.html',
  styleUrls: ['./album-list-new.component.scss']
})
export class AlbumListNewComponent implements OnInit, AfterViewInit {
  albums: Album[];
  total = 0;
  linesPerPage = 0;
  columnsPerpage = 5;
  pageSize = 5;
  pageSizeOptions = [1, 2, 3, 4, 5, 6];
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(private albumService: AlbumService, public mediaObserver: MediaObserver) {
    mediaObserver.media$.subscribe(ms => {
      switch (ms.mqAlias) {
        case 'xs':
          this.initPaginator(1);
          break;
        case 'sm':
          this.initPaginator(3);
          break;
        case 'md':
          this.initPaginator(4);
          break;
        case 'lg':
          this.initPaginator(5);
          break;
      }
    });
  }

  ngOnInit() {
    this.fetchAlbums("", new Paging(0, this.pageSize, "title", "asc"));
  }

  initPaginator(numcols: number) {
    if (this.linesPerPage == 0) {
      if (localStorage.getItem("albumLinesPerPage")) {
        this.linesPerPage = +localStorage.getItem("albumLinesPerPage");
      }
      else {
        this.linesPerPage = 1;
      }
    }
    this.columnsPerpage = numcols;
    this.pageSizeOptions = [1 * numcols, 2 * numcols, 3 * numcols, 4 * numcols, 5 * numcols, 6*numcols];
    this.pageSize = this.linesPerPage * numcols;
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe($event => {
      this.linesPerPage = $event.pageSize / this.columnsPerpage;
      localStorage.setItem("albumLinesPerPage", "" + ($event.pageSize / this.columnsPerpage));
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

  fetchAlbums(filter: string, paging: Paging) {
    this.albumService.getAllAlbums(filter, paging).subscribe(albums => {
      this.albums = albums.albums;
      this.total = albums.total;
    });
  }
}
