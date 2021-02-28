import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PricesCalculationService} from '../../services/prices-calculation.service';
import {ViewTypeService} from '../../services/view-type.service';
import {HardWorkDto} from '../../models/hardwork-dto';
import {Utils} from '../../static/utils';
import {StaticValues} from '../../static/static-values';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';

@Component({
  selector: 'app-tvl-box',
  templateUrl: './tvl-box.component.html',
  styleUrls: ['./tvl-box.component.scss']
})
export class TvlBoxComponent implements OnInit {
  @Input() tvlName: string;
  @Input() name: string;
  @ViewChild('tvlModal') private tvlModal: CustomModalComponent;
  openApyDetails = false;

  constructor(private pricesCalculationService: PricesCalculationService,
              public vt: ViewTypeService) {
  }

  get tvls(): Map<string, number> {
    return this.pricesCalculationService.tvls;
  }

  get hardWorks(): Map<string, HardWorkDto> {
    return this.pricesCalculationService.lastHardWorks;
  }

  get psIncome(): number {
    return this.pricesCalculationService.psIncome();
  }

  get psApy(): number {
    return Utils.aprToApyEveryDayReinvest(this.psApr);
  }

  get psApr(): number {
    return this.pricesCalculationService.latestHardWork?.psApr;
  }

  get psFarmApy(): number {
    return Utils.aprToApyEveryDayReinvest(this.psFarmApr);
  }

  get psFarmApr(): number {
    return 0;
  }

  vaultFullApr(name: string): string {
    if (Utils.isAutoStakeVault(name)) {
      return this.vaultRewardAprPrettify(name);
    }
    return (this.vaultApr(name) + this.vaultRewardApr(name)).toFixed(1);
  }

  vaultFullApy(name: string): string {
    if (name === 'PS') {
      return this.vaultRewardApyPrettify(name);
    }
    if (Utils.isAutoStakeVault(name)) {
      return this.vaultRewardAprPrettify(name);
    }
    return Utils.prettifyNumber(this.vaultApy(name) + this.vaultRewardApy(name));
  }

  vaultApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultApr(tvlName));
  }

  vaultApr(tvlName: string): number {
    return Math.max(this.pricesCalculationService.incomeApr(tvlName), 0);
  }

  vaultRewardApy(tvlName: string): number {
    return Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(tvlName));
  }

  vaultRewardAprPrettify(tvlName: string): string {
    return Utils.prettifyNumber(this.vaultRewardApr(tvlName));
  }

  vaultRewardApyPrettify(tvlName: string): string {
    // return Utils.prettifyNumber(Utils.aprToApyEveryDayReinvest(this.vaultRewardApr(tvlName)));
    return Utils.prettifyNumber(this.pricesCalculationService.vaultRewardWeeklyApy(tvlName));
  }

  vaultRewardApr(tvlName: string): number {
    return this.pricesCalculationService.vaultRewardApr(tvlName);
  }

  vaultPrettyName(name: string): string {
    return StaticValues.vaultPrettyName(name);
  }

  ngOnInit(): void {
  }

  getImgSrc(name: string): string {
    return StaticValues.getImgSrcForVault(name);
  }

  openTvlDialog(): void {
    this.tvlModal.open();
  }

  openApyDetailsWindow(): void{
    this.openApyDetails = true;
  }

  hideApyDetails(show: boolean): void {
    this.openApyDetails = show;
  }

  tvlValueGradient(tvlName: string): string {
    const minMax = this.findMinMax(this.tvls.values());
    const alpha = this.percentOfMinMax(this.tvls.get(tvlName), minMax[0], minMax[1] * 0.1);
    return 'rgba(0, 0, 0, ' + alpha + ')';
  }

  incomeVaultValueGradient(tvlName: string): string {
    const prices = [];
    for (const hw of this.hardWorks.values()) {
      prices.push(hw?.fullRewardUsdTotal);
    }
    const minMax = this.findMinMax(prices);
    const alpha = this.percentOfMinMax(this.hardWorks.get(tvlName)?.fullRewardUsdTotal, minMax[0], minMax[1] * 0.03);
    return 'rgba(0, 0, 0, ' + alpha + ')';
  }

  private percentOfMinMax(value: number, min: number, max: number): number {
    const floor = 0.7;
    const perc = (value - min) / (max - min);
    if (perc < floor) {
      return floor;
    }
    if (perc > 1) {
      return 1;
    }
    return perc;
  }

  private findMinMax(arr): number[] {
    let min = 9999999999999.0;
    let max = 0.0;
    for (const tvl of arr) {
      if (tvl < min) {
        min = tvl;
      }
      if (tvl > max) {
        max = tvl;
      }
    }
    return [min, max];
  }
}
