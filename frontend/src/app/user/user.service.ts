import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {User, UserCollection} from "./user.model";
import {Paging} from "../shared/paging.model";
import {isNullOrUndefined} from "util";
import {BaseService} from "../shared/base.service";

@Injectable()
export class UserService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  getUsers(filter: string, paging?: Paging): Observable<UserCollection> {
    let parameter =  this.getPagingForUrl(paging);
    if (!isNullOrUndefined(filter) && filter !== "") {
      if (parameter === "") {
        parameter = "?filter=" + filter;
      } else {
        parameter += "&filter=" + filter;
      }
    }
    return this.http.get<UserCollection>(environment.restserver + "/api/admin/user" + parameter);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(environment.restserver + "/api/admin/user/" + id);
  }

  saveUser(user: User): Observable<User> {
    if (user.id === null || user.id === "") {
      return this.http.post<User>(environment.restserver + "/api/admin/user", user);
    } else {
      return this.http.put<User>(environment.restserver + "/api/admin/user", user);
    }
  }
  deleteUser(id: string): Observable<number> {
    return this.http.delete<number>(environment.restserver + "/api/admin/user/" + id);
  }
}
