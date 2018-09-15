import { Component, OnInit } from '@angular/core';
import {PlaylistService} from "./playlist.service";
import {Playlist} from "./playlist.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Song, SongCollection} from "../song/song.model";
import {PlayerService} from "../player/player.service";
import {SongService} from "../song/song.service";

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  playlist: Playlist;
  songs: Song[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private playerService: PlayerService,
    private songService: SongService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.playlistService.getPlaylist(params.get('id')).subscribe((playlist: Playlist) => {
        this.playlist = playlist;
      });
      this.songService.getAllSongsOfPlaylist(params.get('id')).subscribe((songs: SongCollection) => {
        this.songs = songs.songs;
      });
    });
  }

  playSong(song: Song) {
    this.playerService.playSong(song);
  }
}
