import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/index";
import {SearchResult} from "./search.model";

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(environment.restserver + "/api/search?q=" + query);
  }
}
