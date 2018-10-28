import {Component, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material";
import {PlaylistService} from "../playlist/playlist.service";
import {Playlist} from "../playlist/playlist.model";

@Component({
  selector: 'app-playlist-select-dialog',
  templateUrl: './playlist-select-dialog.component.html',
  styleUrls: ['./playlist-select-dialog.component.css']
})
export class PlaylistSelectDialogComponent  implements OnInit {
  playlists: Playlist[];

  selectedPlaylistId: string;

  constructor(
    private playlistService: PlaylistService,
    private dialogRef: MatDialogRef<PlaylistSelectDialogComponent>) {}

  ngOnInit() {
    this.playlistService.getStaticPlaylists().subscribe(playlistCollection => this.playlists = playlistCollection.playlists);
  }

  save() {
    this.dialogRef.close(this.selectedPlaylistId);
  }

  close() {
    this.dialogRef.close();
  }
}
