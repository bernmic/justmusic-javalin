import {Component, OnInit} from "@angular/core";
import {Info, Sync} from "./overview.model";
import {OverviewService} from "./overview.service";
import {Router} from "@angular/router";
import {Song} from "../song/song.model";
import {PlayerService} from "../player/player.service";
import {AuthService} from "../security/auth.service";

@Component({
  selector: 'app-info',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  info: Info;
  sync: Sync;

  constructor(
    private overviewService: OverviewService,
    private playerService: PlayerService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.overviewService.getInfo().subscribe(info => {
      this.info = info;
    });
    this.overviewService.getSync().subscribe(sync => {
      this.sync = sync;
    });
  }

  goto(url: string) {
    this.router.navigate([url]);
  }

  playSong(song: Song) {
    this.playerService.playSong(song);
  }


  isAdmin(): boolean {
    return this.authService.isAdmin()
  }
}
