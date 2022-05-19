import { MirrorNode } from "./mirror.types";
import { Operator } from "./operator.types";

/**
 * Interface
 */
export interface HederaOptions {

  /**
   * Array of operators
   */
  operators: Array<Operator>

  /**
   * Mirror Node
   */
  mirrorNode: MirrorNode

  /**
   * Network choice
   */
  network: 'mainnet' | 'testnet'
}