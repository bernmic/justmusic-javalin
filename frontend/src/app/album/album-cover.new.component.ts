import {Component, Input, OnInit} from '@angular/core';
import {Album} from "./album.model";
import {AlbumService} from "./album.service";

@Component({
  selector: 'app-album-cover-new',
  templateUrl: './album-cover-new.component.html',
  styleUrls: ['./album-cover-new.component.scss']
})
export class AlbumCoverNewComponent implements OnInit{
  @Input() album: Album;
  cover: any;

  constructor(private albumService: AlbumService) {}

  ngOnInit() {
    this.albumService.getCover(this.album).subscribe(
      (res: any) => { this.cover = res; },
      error => {
        this.cover = "/assets/img/defaultAlbum.png";
      }
      )
  }
}
