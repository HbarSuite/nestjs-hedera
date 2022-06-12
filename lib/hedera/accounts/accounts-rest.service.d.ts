import { RestService } from '../rest/rest.service';
/**
 * Injectable
 */
export declare class AccountsRestService {
    private restService;
    /**
     * Transaction Rest Service
     * @param {RestService} restService
     */
    constructor(restService: RestService);
    /**
     * Fetch infos for a given AccountId
     * @param {string} accountId
     * @returns {any} response
     */
    getInfos(accountId: string): Promise<any>;
}
