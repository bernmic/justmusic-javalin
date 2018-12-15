import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {isNullOrUndefined} from "util";

@Injectable()
export class AuthService {
  private auth: Auth = null;

  private loggedIn = new BehaviorSubject<boolean>(false);
  private token: string = null;

  constructor(private router: Router, private http: HttpClient) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  isAdmin() {
    if (isNullOrUndefined(this.auth)) {
      return false;
    }
    return this.auth.isAdmin;
  }

  getToken() {
    return this.token;
  }

  login(username: string, password: string){
    if (username !== '' && password !== '' ) {
      let headers = new HttpHeaders();
      headers = headers.append("Authorization", "Basic " + btoa(username + ":" + password));
      // headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
      this.http.get(environment.restserver + "/token", {headers: headers}).subscribe(response => {
        this.token = response['token'];
        this.auth = new Auth(response['token'], username, response['role'] === "admin");
        console.log("Successfully logged in with token " + this.token);
        this.loggedIn.next(true);
        this.router.navigate(['/']);
      }, error => {
        console.log("Got an error while logging in");
        this.loggedIn.next(false);
      });
    }
  }

  logout() {                            // {4}
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  // for debugging
  clearToken(): void {
    this.token = null;
  }
}

export class Auth {
  constructor(public token: string, public username: string, public isAdmin: boolean) {}
}
