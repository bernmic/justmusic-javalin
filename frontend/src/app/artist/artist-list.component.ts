import {Component, Input} from '@angular/core';
import {Artist} from "./artist.model";

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent {

  @Input()
  artists: Artist[];
}
