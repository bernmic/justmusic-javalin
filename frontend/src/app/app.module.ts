import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule, MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";

import {AppComponent} from './app.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlaylistService} from "./playlist/playlist.service";
import {PlaylistDetailComponent} from "./playlist/playlist-detail.component";
import {AlbumListComponent} from './album/album-list.component';
import {ArtistListComponent} from './artist/artist-list.component';
import {SongService} from "./song/song.service";
import {PlayerComponent} from './player/player.component';
import {PlayerService} from "./player/player.service";
import {DurationPipe} from "./shared/duration.pipe";
import {SongListComponent} from "./song/song-list.component";
import {AlbumService} from "./album/album.service";
import {ArtistService} from "./artist/artist.service";
import {AlbumCoverComponent} from "./album/album-cover.component";
import {UnixdatePipe} from "./shared/unixdate.pipe";
import {LoginComponent} from "./security/login.component";
import {AuthService} from "./security/auth.service";
import {AuthGuardService} from "./security/auth-guard.service";
import {TokenInterceptor} from "./security/token.interceptor";
import {PlaylistSelectDialogComponent} from "./song/playlist-select-dialog.component";
import {OverviewComponent} from "./overview/overview.component";
import {OverviewService} from "./overview/overview.service";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { ConfigComponent } from './config/config.component';
import {ConfigService} from "./config/config.service";
import {UserListComponent} from "./user/user-list.component";
import {UserDetailComponent} from "./user/user-detail.component";
import {UserService} from "./user/user.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {AlbumCoverNewComponent} from "./album/album-cover.new.component";
import {AlbumListNewComponent} from "./album/album-list-new.component";
import {ArtistNewListComponent} from "./artist/artist-new-list.component";

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent, canActivate: [AuthGuardService] },
  { path: 'playlist/:id', component: PlaylistDetailComponent, canActivate: [AuthGuardService] },
  { path: 'song', component: SongListComponent, canActivate: [AuthGuardService] },
  { path: 'song/:type/:id', component: SongListComponent, canActivate: [AuthGuardService] },
  { path: 'album', component: AlbumListComponent, canActivate: [AuthGuardService] },
  { path: 'album-new', component: AlbumListNewComponent, canActivate: [AuthGuardService] },
  { path: 'artist', component: ArtistListComponent, canActivate: [AuthGuardService] },
  { path: 'artist-new', component: ArtistNewListComponent, canActivate: [AuthGuardService] },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuardService] },
  { path: 'config', component: ConfigComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserListComponent, canActivate: [AuthGuardService] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    PlaylistDetailComponent,
    PlaylistSelectDialogComponent,
    SongListComponent,
    AlbumListComponent,
    AlbumListNewComponent,
    AlbumCoverComponent,
    AlbumCoverNewComponent,
    ArtistListComponent,
    ArtistNewListComponent,
    PlayerComponent,
    LoginComponent,
    OverviewComponent,
    DurationPipe,
    UnixdatePipe,
    ConfigComponent,
    UserListComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    LayoutModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    ScrollingModule
  ],
  providers: [
    PlaylistService,
    SongService,
    PlayerService,
    AlbumService,
    ArtistService,
    OverviewService,
    ConfigService,
    UserService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PlaylistSelectDialogComponent]
})
export class AppModule { }
