import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlaylistService} from "./playlist.service";
import {Playlist} from "./playlist.model";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  playlist: Playlist;

  @ViewChild('name') nameInput: ElementRef;
  @ViewChild('query') queryInput: ElementRef;

  KIND_QUERY = "query";
  KIND_EMPTY = "empty";

  kind = this.KIND_QUERY;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playlistService: PlaylistService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id') === null || params.get('id') === "new") {
        this.playlist = new Playlist("", "", "");
        return;
      }
      this.playlistService.getPlaylist(params.get('id')).subscribe((playlist: Playlist) => {
        this.playlist = playlist;
        this.nameInput.nativeElement.value = this.playlist.name;
        if (!isNullOrUndefined(this.queryInput)) {
          this.queryInput.nativeElement.value = this.playlist.query;
          this.kind = this.KIND_QUERY;
        } else {
          this.kind = this.KIND_EMPTY;
        }
      });
    });
  }

  save() {
    this.playlist.name = this.nameInput.nativeElement.value;
    if (!isNullOrUndefined(this.queryInput)) {
      this.playlist.query = this.queryInput.nativeElement.value;
    }
    this.playlistService.savePlaylist(this.playlist).subscribe(() => {
      this.router.navigate(["/playlist"]);
    });
  }

  isNew(): boolean {
    if (!isNullOrUndefined(this.playlist)) {
      if (this.playlist.playlistId === "" || this.playlist.playlistId === null) {
        return true;
      }
    }
    return false;
  }

  queryAdd(s: string) {
    this.queryInput.nativeElement.value = this.queryInput.nativeElement.value + s;
    this.queryInput.nativeElement.focus();
  }
}
