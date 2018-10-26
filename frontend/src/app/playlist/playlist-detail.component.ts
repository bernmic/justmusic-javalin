import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlaylistService} from "./playlist.service";
import {Playlist} from "./playlist.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  playlist: Playlist;

  @ViewChild('name') nameInput: ElementRef;
  @ViewChild('query') queryInput: ElementRef;

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
        this.queryInput.nativeElement.value = this.playlist.query;
      });
    });
  }

  save() {
    this.playlist.name = this.nameInput.nativeElement.value;
    this.playlist.query = this.queryInput.nativeElement.value;
    this.playlistService.savePlaylist(this.playlist).subscribe(p => {
      this.router.navigate(["/playlist"]);
    });
  }

}
