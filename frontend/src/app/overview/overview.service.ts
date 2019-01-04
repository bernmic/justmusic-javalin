import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Info, Sync} from "./overview.model";
import {AuthService} from "../security/auth.service";

@Injectable()
export class OverviewService {
  constructor(
    private http: HttpClient
    ) {}

  getInfo(): Observable<Info> {
    return this.http.get<Info>(environment.restserver + "/api/info");
  }

  getSync(): Observable<Sync> {
    return this.http.get<Sync>(environment.restserver + "/api/admin/sync")
  }
}
