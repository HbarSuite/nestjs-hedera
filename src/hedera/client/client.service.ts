import { Injectable, Inject, Logger } from '@nestjs/common';
import { Client } from '@hashgraph/sdk';
import { OnEvent } from '@nestjs/event-emitter';
import { Operator } from '../../types/operator.types';
import { HederaOptions } from '../../types/hedera_options.types';

@Injectable()
export class ClientService {

  /**
   * Client
   */
  private client: Client;

  /**
   * Single Operator
   */
  private operator: Operator;

  /**
   * Array of Operators
   */
  private operators: Array<Operator>;

  /**
   * Network choice
   */
  private network: 'mainnet' | 'testnet';

  /**
   * Logger Service
   */
  private logger: Logger = new Logger("Client Service");

  /**
   * Hedera Network variables
   * @param {HederaOptions} hederaOptions 
   */
  constructor(
    @Inject('hederaOptions') private hederaOptions: HederaOptions
  ) {
    this.network = this.hederaOptions.network;
    this.operators = this.hederaOptions.operators;
    
    /**
     * Create our connection to the Hedera network...
     */
    this.client = this.getClient();
    this.operator = this.getNodeOperator();
  }

  /**
   * If the client gives invalid node error...
   * @returns random operator...
   */
  @OnEvent('client.invalid_node_operator')
  getClient(): Client {
    if (this.network == 'testnet') {
      this.client = Client.forTestnet();
    } else {
      this.client = Client.forMainnet();
    }
    
    this.operator = this.operators[Math.floor(Math.random() * this.operators.length)];
    this.client.setOperator(this.operator.accountId, this.operator.privateKey);
    return this.client;
  }

  /**
   * Gets a node operator
   * @returns {Operator}
   */
  getNodeOperator(): Operator {
    return this.operator;
  }  
}

