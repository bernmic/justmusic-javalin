import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message: string;

  username: string;
  password: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  login() {
    this.authService.login(this.username, this.password);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.message = params.get("message");
    });
  }
}
