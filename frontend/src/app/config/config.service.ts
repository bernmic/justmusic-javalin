import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "./config.model";
import {environment} from "../../environments/environment";

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {}

  getConfig(): Observable<Config> {
    return this.http.get<Config>(environment.restserver + "/api/admin/config");
  }

  saveConfig(config: Config): Observable<Config> {
    return this.http.put<Config>(environment.restserver + "/api/admin/config", config);
  }
}
