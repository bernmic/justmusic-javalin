import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Paging} from "../shared/paging.model";
import {catchError, finalize} from "rxjs/operators";
import {User, UserCollection} from "./user.model";
import {UserService} from "./user.service";

export class UserDataSource implements DataSource<User> {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public userTotalSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public users: User[] = [];

  public loading$ = this.loadingSubject.asObservable();

  constructor(private userService: UserService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.userTotalSubject.complete();
    this.loadingSubject.complete();
  }

  loadUsers(filter: string, paging: Paging) {
    this.loadingSubject.next(true);

    let usersObservable: Observable<UserCollection>;

    usersObservable = this.userService.getUsers(filter, paging);
    usersObservable
      .pipe(
        catchError(() => of(new UserCollection([], null, 0))),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(userCollection => {
        this.userTotalSubject.next(userCollection.total);
        this.usersSubject.next(userCollection.users);
        this.users = userCollection.users;
      });
  }
}
