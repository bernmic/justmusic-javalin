import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {AuthService} from "./security/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  theme = 'indigo-pink-light';

  constructor(
    private router: Router,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    if (localStorage.getItem("theme") !== null) {
      this.theme = localStorage.getItem("theme");
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  currentTheme() {
    return {[this.theme]: true};
  }

  setCurrentTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
  }

  private query: string;

  search($event) {
    if ($event.charCode === 13) {
      console.log("Search for " + this.query);
      this.router.navigate(["/search", this.query]);
    }
  }
}
