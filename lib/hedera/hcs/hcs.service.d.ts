import { TopicInfo, TopicId, PrivateKey, Status, Key, KeyList } from '@hashgraph/sdk';
import { Logger } from '@nestjs/common';
import { ClientService } from '../client/client.service';
/**
 * Injectable
 */
export declare class HcsService {
    private clientService;
    /**
     * Logger Service
     */
    protected logger: Logger;
    /**
     * HCS Service
     * @param {ClientService} clientService
     */
    constructor(clientService: ClientService);
    /**
     * Create topic
     * @param {PrivateKey} adminKey
     * @param {Key} submitKey
     * @param {string} memo
     * @returns {TopicId}
     */
    createTopic(adminKey?: PrivateKey, submitKey?: Key | KeyList, memo?: string): Promise<TopicId | null>;
    /**
     * Update topic
     * @param {TopicId} topicId
     * @param {PrivateKey} currentAdminKey
     * @param {PrivateKey} adminKey
     * @param {Key} submitKey
     * @param {string} memo
     * @returns {Status}
     */
    updateTopic(topicId: TopicId, currentAdminKey?: PrivateKey, adminKey?: PrivateKey, submitKey?: Key | KeyList, memo?: string): Promise<Status>;
    /**
     * Delete topic
     * @param {TopicId} topicId
     * @param {PrivateKey} adminKey
     * @returns {Status}
     */
    deleteTopic(topicId: TopicId, adminKey: PrivateKey): Promise<Status>;
    /**
     * Get topic info
     * @param {TopicId} topicId
     * @returns {TopicInfo}
     */
    topicInfo(topicId: TopicId): Promise<TopicInfo>;
    /**
     * Submit Message
     * @param {TopicId} topicId
     * @param {string} message
     * @param {PrivateKey} submitKey
     * @returns {string}
     */
    submitMessage(topicId: TopicId, message: string | Uint8Array, submitKey?: PrivateKey): Promise<string | undefined>;
    /**
     * Get topic message
     * @param {TopicId} topicId
     * @param {any} callback
     * @param {number} start
     * @param {number} end
     * @param {number} limit
     * @returns {any} Subscription Message
     */
    getMessages(topicId: TopicId, callback: (message: any) => void, start?: number, end?: number, limit?: number): Promise<any>;
}
