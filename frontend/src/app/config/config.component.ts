import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Application, Config, Database, Media, Server} from "./config.model";
import {ConfigService} from "./config.service";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  config: Config;
  databaseType: string;
  databaseSchema: string;
  databaseUsername: string;
  databasePassword: string;
  databaseUrl: string;
  mediaPath: string;
  mediaSyncFrequency: string;
  mediaSyncAtStart = false;
  serverPort: number;
  applicationMode: string;
  applicationLoglevel: string;
  applicationCors: string;
  message: string;

  constructor(private configService: ConfigService, private _location: Location) { }

  ngOnInit() {
    this.configService.getConfig().subscribe(c => {
      console.log(c);
      this.config = c;
      this.resetFields();
    });
  }

  resetFields() {
    this.databaseType = this.config.database.type;
    this.databaseSchema = this.config.database.schema;
    this.databaseUsername = this.config.database.username;
    this.databasePassword = this.config.database.password;
    this.databaseUrl = this.config.database.url;
    this.mediaPath = this.config.media.path;
    this.mediaSyncFrequency = this.config.media.syncfrequency;
    this.mediaSyncAtStart = this.config.media.syncatstart;
    this.serverPort = this.config.server.port;
    this.applicationMode = this.config.application.mode;
    this.applicationLoglevel = this.config.application.loglevel;
    this.applicationCors = this.config.application.cors;
  }

  cancelClicked() {
    this._location.back();
  }

  saveConfig() {
    let db = new Database(this.databaseUsername, this.databasePassword, this.databaseSchema, this.databaseType, this.databaseUrl);
    let media = new Media(this.mediaPath, this.mediaSyncFrequency, this.mediaSyncAtStart);
    let server = new Server(this.serverPort);
    let application = new Application(this.applicationMode, this.applicationLoglevel, this.applicationCors);
    this.configService.saveConfig(new Config(application, server, db, media)).subscribe(c => {
      this.config = c;
      this.resetFields();
      this.message = "Configuration saved. Restart service to activate.";
    });
  }
}
