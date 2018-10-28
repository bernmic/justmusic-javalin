import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Info} from "./overview.model";

@Injectable()
export class OverviewService {
  constructor(private http: HttpClient) {}

  getInfo(): Observable<Info> {
    return this.http.get<Info>(environment.restserver + "/api/info");
  }
}
