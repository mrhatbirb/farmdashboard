import {TransferDto} from '../models/transfer-dto';
import {HarvestDto} from '../models/harvest-dto';

export class Utils {

  public static aprToApyEveryDayReinvest(apr: number): number {
    if (!apr || apr === 0.0) {
      return 0.0;
    }
    return Utils.aprToApy(apr, 365);
  }

  public static aprToApy(apr: number, period: number): number {
    return (Math.pow(1.0 + ((apr / 100) / period), period) - 1.0) * 100;
  }

  public static isUni(record: any): boolean {
    return !!record.type;
  }

  public static isTransfer(record: any): boolean {
    return !!record.recipient;
  }

  public static isTransferPositive(record: any, address: string): boolean {
    return Utils.isTransfer(record) && record.recipient.toLowerCase() === address.toLowerCase();
  }

  public static isUniTrade(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'BUY' || record.type === 'SELL');
  }

  public static isUniPositive(record: any): boolean {
    return Utils.isUni(record) && (record.type === 'BUY' || record.type === 'ADD');
  }

  public static isHarvest(record: {vault: string}): boolean {
    return !!record.vault;
  }

  public static isHarvestPositive(record: {vault: string; methodName: string}): boolean {
    return Utils.isHarvest(record) && record.methodName === 'Deposit';
  }

  public static transferBalance(t: TransferDto, address: string): number {
    if (address.toLowerCase() === t.owner.toLowerCase()) {
      return t.balanceOwner;
    } else if (address.toLowerCase() === t.recipient.toLowerCase()) {
      return t.balanceRecipient;
    }
    return 0;
  }

  public static transferBalanceUsd(t: TransferDto, address: string): number {
    return Utils.transferBalance(t, address) * t.price;
  }

  public static openEtherscanTx(hash: string): void {
    window.open('https://etherscan.io/tx/' + hash, '_blank');
  }

  public static openHistory(hash: string): void {
    window.open('/history/' + hash, '_blank');
  }

  public static priceGradientHarvest(type: string, amount: number, success: boolean): string {
    if (success) {
      switch (type.toLowerCase()) {
        case 'deposit':
          if (amount > 1000000) {
            return '#83b78c';
          } else if (amount > 200000) {
            return '#8cb894';
          } else if (amount > 50000) {
            return '#96ba9d';
          } else {
            return '#a1bca6';
          }
        case 'withdraw':
          if (amount > 1000000) {
            return '#c15b5b';
          } else if (amount > 200000) {
            return '#c36666';
          } else if (amount > 50000) {
            return '#c47272';
          } else {
            return '#c37d7d';
          }
      }
    } else {
      return '#474646';
    }
    return '#ffffff';
  }

  public static prettyTransferType(type: string): string {
    if (!type) {
      return '';
    }
    switch (type) {
      case 'COMMON':
        return 'Transfer';
      case 'LP_SELL':
        return 'Sell';
      case 'LP_BUY':
        return 'Buy';
      case 'REWARD':
        return 'Reward';
      case 'PS_STAKE':
        return 'PS Stake';
      case 'PS_EXIT':
        return 'PS Exit';
      case 'ONE_INCH':
        return '1Inch';
      case 'ZERO_X':
        return 'ZeroX';
    }
    return type;
  }

  public static isAutoStakeVault(name: string): boolean {
    return name === 'PS'
        || name === 'DAI_BSG'
        || name === 'DAI_BSGS'
        || name === 'SUSHI_MIC_USDT'
        || name === 'SUSHI_MIS_USDT'
        || name === 'MAAPL_UST'
        || name === 'MAAPL_UST'
        || name === 'MAMZN_UST'
        || name === 'MGOOGL_UST'
        || name === 'MTSLA_UST'
        || name === 'MNFLX_UST'
        || name === 'MTWTR_UST'
        || name === 'UNI_BAC_DAI'
        || name === 'UNI_DAI_BAS'
        || name === 'UNI_WBTC_KLON'
        || name === 'UNI_WBTC_KBTC'
        || name === 'SUSHI_HODL'
        || name === 'ETH_DAI_HODL'
        || name === 'ETH_USDC_HODL'
        || name === 'ETH_USDT_HODL'
        || name === 'ETH_WBTC_HODL'
        || name === 'MUSE_ETH'
        || name === 'DUDES20_ETH'
        || name === 'MASK20_ETH'
        || name === 'ROPE20_ETH'
        || name === 'MCAT20_ETH'
        ;
  }

  public static isFarmVault(name: string): boolean {
    return name.indexOf('FARM') >= 0;
  }

  public static prettifyNumber(n: number): string {
    if (n < 1000) {
      return n.toFixed(1);
    } else if (n < 1000_000) {
      return (n / 1000).toFixed(1) + 'k';
    } else if (n < 1000_000_000) {
      return (n / 1000_000).toFixed(1) + 'm';
    } else if (n < 1000_000_000_000) {
      return (n / 1000_000_000).toFixed(1) + 'g';
    } else {
      return '♾️';
    }
  }

  public static iterableReduce(arr: IterableIterator<any>, mapper = a => a): number {
    if (!arr) {
      return 0;
    }
    return Array.from(arr)
    .filter(a => !!a)
    .map(mapper)
    .reduce((n, p) => n + p, 0);
  }

  public static prettyVaultName(name: string): string {
    if (name.split('_').length >= 3) {
      name = name.replace('ONEINCH_', '');
    }
    return name.replace('ONEINCH', '1INCH');
  }

  public static addInMap(map: Map<any, number>, key: any, value: number): void {
    if (!!value
        && value.toString() !== 'NaN'
        && value !== 0) {
      map.set(key, value);
    }
  }

  public static addInArrayAtTheStart<T>(arr: T[], el: T, max: number = 100): void {
    arr.unshift(el);
    if (arr.length > max) {
      arr.pop();
    }
  }
}
