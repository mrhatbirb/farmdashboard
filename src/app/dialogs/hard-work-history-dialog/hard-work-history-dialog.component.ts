import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ViewTypeService} from '../../services/view-type.service';
import {NGXLogger} from 'ngx-logger';
import {ChartBuilder} from '../../chart/chart-builder';
import {DialogData} from '../dialog-data';

@Component({
  selector: 'app-hard-work-history-dialog',
  templateUrl: './hard-work-history-dialog.component.html',
  styleUrls: ['./hard-work-history-dialog.component.scss']
})
export class HardWorkHistoryDialogComponent implements AfterViewInit {
  @ViewChild('chart') chartEl: ElementRef;
  ready = false;

  constructor(private httpService: HttpService,
              // @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public vt: ViewTypeService,
              private cdRef: ChangeDetectorRef,
              private log: NGXLogger) {
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.httpService.getHardWorkHistoryData().subscribe(data => {
      this.log.debug('History of All Hard Works loaded ', data);
      const chartBuilder = new ChartBuilder();
      const hwFees = new Map<number, number>();
      let savedGas = 0;
      data?.forEach(dto => {
        savedGas += dto.savedGasFees;
        hwFees.set(dto.blockDate, savedGas);
      });
      chartBuilder.initVariables(1);
      hwFees.forEach((fees, date) => chartBuilder.addInData(0, date, fees / 1000000));
      this.handleData(chartBuilder, [
        ['Saved Gas Fees M$', 'right', '#0085ff']
      ]);
    });
  }

  private handleData(chartBuilder: ChartBuilder, config: string[][]): void {
    this.ready = true;
    this.cdRef.detectChanges();
    console.log(this.chartEl);
    const chart = chartBuilder.initChart(this.chartEl);
    chartBuilder.addToChart(chart, config);
  }

}
