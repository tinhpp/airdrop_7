/* eslint-disable @typescript-eslint/no-empty-function */
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import * as FACTORY_ABI from './abi/LendingPool.json';
import * as ERC20_ABI from './abi/ERC20.json';

@Injectable()
export class LendingPoolService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private lendingPoolContract: Contract;

  constructor() {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.lendingPoolContract = new Contract(
      config.ENV.LENDING_POOL_ADDRESS,
      FACTORY_ABI,
      this.rpcProvider,
    );
  }

  async getStakedPerUser(
    account: string,
    options: Record<string, any>,
  ): Promise<number> {
    const userInfo = await this.lendingPoolContract.userInfo(account, {
      ...options,
    });
    return Number(ethers.formatEther(userInfo.amount));
  }

  async getTotalStaked(options: Record<string, any>) {
    const poolInfo = await this.lendingPoolContract.poolInfo({ ...options });
    return ethers.formatUnits(poolInfo.stakedSupply, 18);
  }

  async getBlockNumber() {
    return this.rpcProvider.getBlockNumber();
  }

  async depositBonusToTreasury() {
    try {
      const signer = new ethers.Wallet(
        process.env.OPERATOR_ACCOUNT_PRIVATE_KEY,
        this.rpcProvider,
      );
      const erc20Contract = new Contract(
        config.ENV.WXCR_ADDRESS,
        ERC20_ABI,
        signer,
      );

      const treasury = await this.lendingPoolContract.treasury();
      const tx = await erc20Contract.mint(
        treasury,
        ethers.parseUnits('72', 18),
      );
    } catch (error) {
      console.log('error', error);
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
