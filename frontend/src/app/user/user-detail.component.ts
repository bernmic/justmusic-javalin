import {Component, Input, OnInit} from "@angular/core";
import {UserService} from "./user.service";
import {User} from "./user.model";
import {Playlist} from "../playlist/playlist.model";
import {isNullOrUndefined} from "util";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user: User = new User("", "", "", "");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id') !== "new") {
        this.loadUser(params.get('id'));
      }
    });
  }

  resetFields(): void {
    if (this.user.id === "") {
      this.user = new User("", "", "", "");
    } else {
      this.loadUser(this.user.id);
    }
  }

  loadUser(id: string): void {
    this.userService.getUser(id).subscribe((user: User) => {
      this.user = user;
    });
  }

  saveUser(): void {
    this.userService.saveUser(this.user).subscribe(u => this.user = u);
  }

  deleteUser(): void {
    this.userService.deleteUser(this.user.id).subscribe(() => {
      this.router.navigate(["/user"]);
    })
  }
}
