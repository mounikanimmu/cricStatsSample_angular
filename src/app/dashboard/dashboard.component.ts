import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Players } from '.././Players';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Player 1' },
    { data: [30, 49, 60, 90, 50, 40, 90], label: 'Player 2' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartOptions: (ChartOptions) = {
    responsive: true,
  };

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];



  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Player 1' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Player 2' }
  ];

  compare_value = false;
  public datasource: any;

  ngOnInit() {
    this.globalService.getServiceCall('/api/players', (result) => {
      //console.log("***************************" + JSON.stringify(result.data));
      this.dataSource = new MatTableDataSource(result.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private dataSource: MatTableDataSource<Players>;
  private selection = new SelectionModel<Players>(true, []);

  displayedColumns: string[] = ['select', 'position', 'players_name', 'age', 'matches', 'runs', 'highest_score', 'average', 'strike_rate'];
  displayedColumn: string[] = ['position', 'players_name', 'age', 'fifty', 'century', 'wickets', 'catches', 'stumping', 'appearance_of_worldcup'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(private globalService: GlobalService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  public selectedplayerslist;
  selectedRows: Array<{}> = []

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  //** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Players): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  store() {
    setTimeout(() => {
      this.selectedRows = this.selection.selected;
      // console.log("selectedRows: ", this.selectedRows);
      // console.log("lenght:", this.selectedRows.length);
    });
  }

  compare() {
    if (this.selectedRows.length <= 1 || this.selectedRows.length >= 3) {
      alert("Please select only two players to compare!");
      //console.log('no player is selected');
      return "Select a Player"
    } else {
      //this.openDialog();
      this.compare_value = true;
      this.datasource = this.selectedRows;
      this.snackBar.open('Please scroll down to view table!', null, {
        duration: 3000,
      });
      //console.log("selectedRows: ", this.selectedRows);
      //console.log(this.selectedRows.length);
    }
  }


  closetable() {
    this.compare_value = false;
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(CompareDialog, {
      width: '250px',
      height: '250px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'compare_dialog',
  templateUrl: 'compare_dialog.html',
})
export class CompareDialog {

  constructor(
    public dialogRef: MatDialogRef<CompareDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Players) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}