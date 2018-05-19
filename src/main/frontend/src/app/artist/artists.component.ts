import { Component, OnInit } from '@angular/core';
import {ArtistService} from "./artist.service";
import {Artist} from "./artist.model";

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

  artists: Artist[];

  constructor(private artistService: ArtistService) { }

  ngOnInit() {
    this.artistService.getAllArtists().subscribe(artists => this.artists = artists.artists);
  }

}
