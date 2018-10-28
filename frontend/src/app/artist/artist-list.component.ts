import {Component, Input} from '@angular/core';
import {Artist} from "./artist.model";
import {Album} from "../album/album.model";
import {ArtistService} from "./artist.service";
import {AlbumService} from "../album/album.service";

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent {
  albums: Album[]

  @Input()
  artists: Artist[];

  constructor(private artistService: ArtistService, private albumService: AlbumService) {}

  panelOpened(artistId: string) {
    this.albums = undefined;
    this.artistService.getAlbumsForArtist(artistId).subscribe(albums => {
      this.albums = albums;
    });
  }

  coverUrl(album: Album): string {
    return this.albumService.albumCoverUrl(album);
  }
}
