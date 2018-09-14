import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {Song, SongCollection} from "./song.model";
import {SongService} from "./song.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerService} from "../player/player.service";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, Sort} from "@angular/material";
import {PlaylistSelectDialogComponent} from "./playlist-select-dialog.component";
import {PlaylistService} from "../playlist/playlist.service";
import {SongDataSource} from "./song.datasource";
import {Paging} from "../shared/paging.model";
import {tap} from "rxjs/operators";
import {merge} from "rxjs";

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnDefs = [
    {name: 'title', title: 'Title'},
    {name: 'artist.name', title: 'Artist'},
    {name: 'album.title', title: 'Album'},
    {name: 'track', title: 'Tack'},
    {name: 'genre', title: 'Genre'},
    {name: 'yearPublished', title: 'Year'}/*,
    {name: 'duration', title: 'Duration'}*/
  ];

  _songs: Song[] = [];
  headline = "";
  dataSource: SongDataSource;

  kind = "";
  anyId = "";

  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
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
    if (localStorage.getItem("pageSize") !== null) {
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
        this.dataSource.loadSongs(this.kind, this.anyId, new Paging(0, this.pageSize, sortField, "asc"));
        this.dataSource.songTotalSubject.subscribe(total => {
          this.total = total;
          console.log("New Total: " + this.total);
        });
      });
    }
  }

  ngAfterViewInit() {
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
    this.dataSource.loadSongs(this.kind, this.anyId, new Paging(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction));
  }

  setSongs(songCollection: SongCollection) {
    this._songs = songCollection.songs;
    this.headline = songCollection.description;
  }

  @Input()
  get songs(): Song[] {
    return this._songs;
  }

  set songs(songs: Song[]) {
    this.setSongs(new SongCollection(songs, "", null, songs.length));
  }

  playSong(song: Song) {
    this.playerService.playSong(song);
  }

  queueSong(song: Song) {
    this.playerService.addSong(song);
  }

  queueSongs() {
    this.songs.forEach(song => this.playerService.addSong(song));
  }

  addSongToPlaylist(song: Song) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialog = this.dialog.open(PlaylistSelectDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe(v => {
      if (v !== undefined) {
        console.log("add song with id=" + song.songId + " to playlist " + v);
        this.playlistService.addSongsToPlaylist(v, [song.songId]).subscribe(r => console.log(r));
      }
    });
  }

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )
}
