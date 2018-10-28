import {Component, OnInit} from '@angular/core';
import {PlaylistService} from "./playlist.service";
import {Playlist, PlaylistCollection} from "./playlist.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlists: Playlist[];

  constructor(private playlistService: PlaylistService, private router: Router) { }

  ngOnInit() {
    this.playlistService.getPlaylists().subscribe((playlists: PlaylistCollection) => {
      this.playlists = playlists.playlists;
    });
  }

  delete(playlistId: string) {
    this.playlistService.deletePlaylist(playlistId).subscribe(() => this.router.navigate(["/playlist"]));
  }
}
