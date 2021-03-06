import {Network} from '../models/network';

export class StaticValues {
  public static SECONDS_OF_DAY = 60 * 60 * 24;
  public static SECONDS_OF_MONTH = StaticValues.SECONDS_OF_DAY * 30;
  public static SECONDS_OF_WEEK = StaticValues.SECONDS_OF_DAY * 7;
  public static SECONDS_OF_YEAR = StaticValues.SECONDS_OF_DAY * 365;

  private static NETWORK_ETH: Network = {
    blockExplorerUrl: 'https://www.bscscan.com',
    chainId: 1,
    ethparserName: 'eth',
    currencySymbol: 'ETH',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/undefined',
  };
  private static NETWORK_BSC: Network = {
    blockExplorerUrl: 'https://etherscan.io',
    chainId: 56,
    ethparserName: 'bsc',
    currencySymbol: 'BNB',
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  };
  public static NETWORKS: Map<string, Network> = new Map<string, Network>([
    ['eth', StaticValues.NETWORK_ETH],
    ['bsc', StaticValues.NETWORK_BSC]
  ]);

  public static farmPools: string[] = [
    'UNI_LP_USDC_FARM',
    'UNI_LP_WETH_FARM',
    'UNI_LP_GRAIN_FARM'
  ];

  public static isPS: Set<string> = new Set<string>([
    'PS_V0',
    'PS',
    'iPS',
  ]);

  public static mapCoinNameToSimple(name: string, network: string): string {
    if (network === 'eth') {
      return StaticValues.mapCoinNameToSimpleEth(name);
    } else if (network === 'bsc') {
      return StaticValues.mapCoinNameToSimpleBsc(name);
    }
    return name;
  }

  private static mapCoinNameToSimpleEth(name: string): string {
    name = name
    .replace('CRV_', '');
    switch (name) {
      case 'CRV_STETH':
      case 'STETH':
      case 'WETH':
      case 'ZERO': // 1inch stubbing
        return 'ETH';
      case 'RENBTC':
      case 'RENWBTC':
      case 'CRVRENWBTC':
      case 'WBTC':
      case 'TBTC':
      case 'CRV_TBTC':
      case 'HBTC':
      case 'CRV_HBTC':
      case 'OBTC':
      case 'CRV_OBTC':
      case 'BTCB':
        return 'WBTC';
      case 'CRV_EURS':
        return 'EURS';
      case 'PS_V0':
      case 'PS':
      case 'iPS':
        return 'FARM';
      case 'CRV_LINK':
        return 'LINK';
      case 'SUSHI_HODL':
        return 'SUSHI';
    }
    return name;
  }

  private static mapCoinNameToSimpleBsc(name: string): string {
    name = name
    .replace('PC_', '')
    .replace('EPS_', '')
    .replace('VENUS_', '');
    switch (name) {
      case 'WETH':
      case 'ZERO': // 1inch stubbing
        return 'ETH';
      case 'RENBTC':
      case 'RENWBTC':
      case 'CRVRENWBTC':
      case 'WBTC':
        return 'BTCB';
      case 'POPSICLE_ICE':
        return 'ICE';
      case 'EPS_FUSDT':
      case 'FUSDT':
        return 'BUSD';
    }
    return name;
  }

  public static isStableCoin(name: string): boolean {
    name = name.replace('CRV_', '');
    switch (name) {
      case 'USD':
      case 'USDC':
      case 'USDT':
      case 'USDN':
      case 'USDP':
      case 'YCRV':
      case '3CRV':
      case 'TUSD':
      case 'DAI':
      case 'CRV_GUSD':
      case 'CRV_AAVE':
      case 'BUSD':
      case 'EPS_3POOL':
      case 'CMPND':
      case '3POOL':
      case 'HUSD':
      case 'NAME':
      case 'GUSD':
      case 'AAVE':
        return true;
      default:
        return false;
    }
  }
}
