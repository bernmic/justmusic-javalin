import {Component, Input, OnInit} from "@angular/core";
import {Album} from "./album.model";
import {AlbumService} from "./album.service";

@Component({
  selector: 'album-cover',
  template: `
    <button routerLink="/song/album/{{album.albumId}}">
      <img [src]="coverUrl" alt="{{album.title}}" class="image">
      <div class="album-info">{{album.title}}</div>
    </button>`,
  styles: [
    '.image {position: relative; top: 0; left: 0; max-width: 100%; max-height: 100%; object-fit: contain;}',
    '.album-info {position: absolute; background-color: rgba(255,255,255,0); color: rgba(0,0,0,0); width: 100%; left: 0px; bottom: 10px; z-index: 1000;}',
    '.album-info:hover {background-color: rgba(255,255,255,0.7); color: rgba(0,0,0,1.0); }'
  ]
})
export class AlbumCoverComponent implements OnInit{

  @Input() album: Album;
  coverUrl: string;

  constructor(private albumService: AlbumService) {
    this.coverUrl = this.albumService.albumCoverUrl(this.album);
  }

  ngOnInit(): void {
    this.coverUrl = this.albumService.albumCoverUrl(this.album);
  }
}
