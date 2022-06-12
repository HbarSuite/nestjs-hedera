import { FileId, FileInfo, PrivateKey, Status } from '@hashgraph/sdk';
import { Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
/**
 * Injectable
 */
export declare class HfsService {
    private clientService;
    /**
     * Logger Service
     */
    protected logger: Logger;
    /**
     * HFS Service
     * @param {ClientService} clientService
     */
    constructor(clientService: ClientService);
    /**
     * Create File
     * @param {PrivateKey} key
     * @param {string} content
     * @param {string} memo
     * @param {number} maxTransactionFee
     * @returns {FileId}
     */
    create(key: PrivateKey, content: string, memo?: string, maxTransactionFee?: number): Promise<FileId | null>;
    /**
     * Append File
     * @param {FileId} fileId
     * @param {PrivateKey} key
     * @param {string} content
     * @param {number} maxTransactionFee
     * @returns {Status}
     */
    append(fileId: FileId, key: PrivateKey, content: string, maxTransactionFee?: number): Promise<Status>;
    /**
     * Update File
     * @param {FileId} fileId
     * @param {string} content
     * @param {PrivateKey} signKey
     * @param {PrivateKey} newKey
     * @param {string} memo
     * @param {number} maxTransactionFee
     * @returns {Status}
     */
    update(fileId: FileId, content: string, signKey: PrivateKey, newKey?: PrivateKey, memo?: string, maxTransactionFee?: number): Promise<Status>;
    /**
     * Delete File
     * @param {FileId} fileId
     * @param {PrivateKey} key
     * @param {number} maxTransactionFee
     * @returns {Status}
     */
    delete(fileId: FileId, key: PrivateKey, maxTransactionFee?: number): Promise<Status>;
    /**
     * Get contents
     * @param {FileId} fileId
     * @returns {string}
     */
    getContents(fileId: FileId): Promise<string>;
    /**
     * Get Info
     * @param {FileId} fileId
     * @returns {FileInfo}
     */
    getInfos(fileId: FileId): Promise<FileInfo>;
}
