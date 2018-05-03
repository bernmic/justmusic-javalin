import { Component, OnInit } from '@angular/core';
import {ArtistService} from "./artist.service";
import {Artist} from "./artist.model";

@Component({
  selector: 'app-artist',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {

  artists: Artist[];

  constructor(private artistService: ArtistService) { }

  ngOnInit() {
    this.artistService.getAllArtists().subscribe(artists => this.artists = artists);
  }

}
