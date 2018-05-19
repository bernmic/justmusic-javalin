import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Playlist} from "../playlist/playlist.model";
import {SongCollection} from "../song/song.model";
import {SearchService} from "./search.service";
import {SearchResult} from "./search.model";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private search: string;
  private searchResult: SearchResult;

  constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.search = params.get("query");
      this.searchService.search(this.search).subscribe(searchResult => this.searchResult = searchResult);
    });
  }

  hasSongs(): boolean {
    return !isNullOrUndefined(this.searchResult) && this.searchResult.songs.length > 0;
  }

  hasAlbums(): boolean {
    return !isNullOrUndefined(this.searchResult) && this.searchResult.albums.length > 0;
  }

  hasArtists(): boolean {
    return !isNullOrUndefined(this.searchResult) && this.searchResult.artists.length > 0;
  }
}
