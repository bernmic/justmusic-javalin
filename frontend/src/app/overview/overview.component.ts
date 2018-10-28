import {Component, OnInit} from "@angular/core";
import {Info} from "./overview.model";
import {OverviewService} from "./overview.service";
import {Router} from "@angular/router";
import {Song} from "../song/song.model";
import {PlayerService} from "../player/player.service";

@Component({
  selector: 'app-info',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  info: Info;

  constructor(private overviewService: OverviewService, private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    this.overviewService.getInfo().subscribe(info => {
      this.info = info;
    });
  }

  goto(url: string) {
    this.router.navigate([url]);
  }

  playSong(song: Song) {
    this.playerService.playSong(song);
  }

}
