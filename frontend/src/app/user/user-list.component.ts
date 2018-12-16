import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {UserService} from "./user.service";
import {MatPaginator, MatSort} from "@angular/material";
import {UserDataSource} from "./user.datasource";
import {Paging} from "../shared/paging.model";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  dataSource: UserDataSource;

  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  total = 0;

  displayedColumns = ['username', 'email', 'role'];

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("pageSize")) {
      this.pageSize = +localStorage.getItem("pageSize");
    }
    this.dataSource = new UserDataSource(this.userService);

    this.dataSource.loadUsers("", new Paging(0, this.pageSize, "username", "asc"));
    this.dataSource.userTotalSubject.subscribe(total => {
      this.total = total;
    });
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadUsersPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadUsersPage())
      )
      .subscribe();
  }

  loadUsersPage() {
    localStorage.setItem("pageSize", "" + this.paginator.pageSize);
    this.dataSource.loadUsers(this.input.nativeElement.value, new Paging(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction));
  }
}
