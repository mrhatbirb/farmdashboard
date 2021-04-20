import {Observable, Subscriber} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {PricesDto} from '../../models/prices-dto';
import {WebsocketService} from '../websocket.service';
import {Network} from '../../models/network';

@Injectable({
    providedIn: 'root'
})
export class PricesService {

    subscribed = false;
    private $subscribers: Subscriber<PricesDto>[] = [];

    constructor(private ws: WebsocketService,
                private httpService: HttpService) {
        this.initWs();
    }

    isSubscribed(): boolean {
        return this.subscribed;
    }

    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    public initWs(): void {
        if (this.ws.registerConsumer(this) && !this.subscribed) {
            this.subscribeToTopic();
            this.setSubscribed(true);
        }
    }

    public subscribeToTopic(): void {
        this.ws.onMessage('/topic/prices', (m => PricesDto.fromJson(m.body)))
            ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
    }

    public subscribeToPrices(): Observable<PricesDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }

    getLastPrices(network?: Network): Observable<PricesDto[]> {
        return this.httpService.httpGet('/price/token/latest', network);
    }

}