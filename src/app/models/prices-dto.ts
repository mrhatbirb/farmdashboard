import {UniswapDto} from './uniswap-dto';

export class PricesDto {
  id: string;
  block: number;
  blockDate: number;
  network: string;
  token: string;
  tokenAmount: number;
  otherToken: string;
  otherTokenAmount: number;
  price: number;
  buy: boolean;
  source: string;

  blockDateAdopted: Date;

  public static fromJson(data: string): PricesDto {
    const tx: PricesDto = Object.assign(new PricesDto(), JSON.parse(data));
    PricesDto.fillBlockDateAdopted(tx);
    return tx;
  }

  public static fillBlockDateAdopted(tx: PricesDto): void {
    if (tx.blockDateAdopted == null) {
      const d = new Date(0);
      d.setUTCSeconds(tx.blockDate);
      tx.blockDateAdopted = d;
    }
  }

  public toUniswap(): UniswapDto {
    const dto = new UniswapDto();
    dto.id = this.id;
    dto.type = this.buy ? 'BUY' : 'SELL';
    dto.owner = '';
    dto.coin = this.token;
    dto.amount = this.tokenAmount;
    dto.otherCoin = this.otherToken;
    dto.otherAmount = this.otherTokenAmount;
    dto.hash = this.id.split('_')[0];
    dto.block = this.block.toString();
    dto.confirmed = true;
    dto.blockDate = this.blockDate;
    dto.blockDateAdopted = this.blockDateAdopted;
    return dto;
  }
}
