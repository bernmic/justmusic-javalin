import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Song, SongCollection} from "./song.model";
import {SongService} from "./song.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerService} from "../player/player.service";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTable} from "@angular/material";
import {PlaylistSelectDialogComponent} from "./playlist-select-dialog.component";
import {PlaylistService} from "../playlist/playlist.service";
import {SongDataSource} from "./song.datasource";
import {Paging} from "../shared/paging.model";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {fromEvent, merge} from "rxjs";

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  columnDefs = [
    {name: 'title', title: 'Title'},
    {name: 'artist.name', title: 'Artist'},
    {name: 'album.title', title: 'Album'},
    {name: 'track', title: 'Tack'},
    {name: 'genre', title: 'Genre'},
    {name: 'yearPublished', title: 'Year'}/*,
    {name: 'duration', title: 'Duration'}*/
  ];

  headline = "";
  dataSource: SongDataSource;

  kind = "";
  anyId = "";

  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  total = 0;

  @Input()
  embedded = false;

  displayedColumns = ['command', 'title', 'artist.name', 'album.title', 'track', 'genre', 'yearPublished', 'duration'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService,
    private playlistService: PlaylistService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (localStorage.getItem("pageSize")) {
      this.pageSize = +localStorage.getItem("pageSize");
    }
    this.dataSource = new SongDataSource(this.songService);
    if (!this.embedded) {
      this.route.paramMap.subscribe((params) => {
        if (params.has("type")) {
          this.kind = params.get("type");
          this.anyId = params.get("id");
        }
        let sortField = "";
        if (this.kind === "album") {
          sortField = "track";
        } else if (this.kind === "artist") {
          sortField = "album.name";
        }
        this.dataSource.loadSongs(this.kind, this.anyId, "", new Paging(0, this.pageSize, sortField, "asc"));
        this.dataSource.songTotalSubject.subscribe(total => {
          this.total = total;
        });
        this.dataSource.songDescriptionSubject.subscribe(s => this.headline = s);
      });
    }
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadSongsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSongsPage())
      )
      .subscribe();
  }

  loadSongsPage() {
    localStorage.setItem("pageSize", "" + this.paginator.pageSize);
    this.dataSource.loadSongs(this.kind, this.anyId, this.input.nativeElement.value, new Paging(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction));
  }

  playSong(song: Song) {
    this.playerService.playSong(song);
  }

  queueSong(song: Song) {
    this.playerService.addSong(song);
  }

  queueSongs() {
    this.dataSource.songs.forEach(song => this.playerService.addSong(song));
  }

  addSongToPlaylist(song: Song) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialog = this.dialog.open(PlaylistSelectDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe(v => {
      if (v !== undefined) {
        this.playlistService.addSongsToPlaylist(v, [song.songId]).subscribe(r => console.log(r));
      }
    });
  }

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )
}
