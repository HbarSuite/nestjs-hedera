import { RestService } from '../rest/rest.service';
/**
 * Injectable
 */
export declare class HtsRestService {
    private restService;
    /**
     * HTS REST Service
     * @param restService
     */
    constructor(restService: RestService);
    /**
     * Get Token Info
     * @param {string} tokenId
     * @returns {any} response
     */
    getTokenInfo(tokenId: string): Promise<any>;
    /**
     * Get array of holders by tokenId
     * @param {string} tokenId
     * @returns {Array}
     */
    getAllHolders(tokenId: string): Promise<Array<any>>;
    /**
     * Get array of holders from walletId
     * @param {string} tokenId
     * @param {string} walletId
     * @returns {Array}
     */
    getAllHoldersFromWallet(tokenId: string, walletId: string): Promise<Array<any>>;
}
