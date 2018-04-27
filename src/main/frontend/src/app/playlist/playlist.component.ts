import { Component, OnInit } from '@angular/core';
import {PlaylistService} from "./playlist.service";
import {Playlist} from "./playlist.model";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlists: Playlist[];

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.playlistService.getPlaylists().subscribe((playlists: Playlist[]) => {
      this.playlists = playlists;
    });
  }

}
