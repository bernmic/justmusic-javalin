import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ArtistService} from "./artist.service";
import {MatPaginator, MatSort} from "@angular/material";
import {ArtistDataSource} from "./artist.datasource";
import {Paging} from "../shared/paging.model";
import {ActivatedRoute, Router} from "@angular/router";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {Artist} from "./artist.model";

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  total = 0;

  columnDefs = [
    {name: 'id', title: 'ID'},
    {name: 'name', title: 'Name'}
  ];

  dataSource: ArtistDataSource;

  displayedColumns = ['name'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private artistService: ArtistService
  ) {}

  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadArtistsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadArtistsPage())
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (localStorage.getItem("pageSize")) {
      this.pageSize = +localStorage.getItem("pageSize");
    }
    this.dataSource = new ArtistDataSource(this.artistService);
      this.route.paramMap.subscribe((params) => {
        this.dataSource.loadArtists("", new Paging(0, this.pageSize, "", "asc"));
        this.dataSource.artistTotalSubject.subscribe(total => {
          this.total = total;
        });
    });
  }

  loadArtistsPage() {
    localStorage.setItem("pageSize", "" + this.paginator.pageSize);
    this.dataSource.loadArtists(this.input.nativeElement.value, new Paging(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction));
  }

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  gotoSongs(artist: Artist) {
    this.router.navigate(["/song/artist/" + artist.artistId]);
  }
}
