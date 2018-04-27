import { Component, OnInit } from '@angular/core';
import {Song} from "../song/song.model";
import {Album} from "../album/album.model";
import {Artist} from "../artist/artist.model";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  currentSong: Song;
  songs: Song[];

  constructor() { }

  ngOnInit() {
    this.currentSong = new Song(
      "",
      "This is a Klaus",
      "",
      0,
      0,
      0,
      0,
      new Album("", "", ""),
      new Artist("", "Fred"), "", 0, "", false, 0, 0);
  }

}
