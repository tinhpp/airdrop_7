import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
const fs = require('fs');
const Hash = require('ipfs-only-hash');

const DACS_STORAGE_FOLDER_PATH = `./dacs-storage`;

@Injectable()
export class DacsService {
  async upload(data: any) {
    try {
      const jsonData = JSON.stringify(data);
      const cid = await Hash.of(jsonData);

      if (!fs.existsSync(DACS_STORAGE_FOLDER_PATH)) {
        fs.mkdirSync(DACS_STORAGE_FOLDER_PATH);
      }

      fs.writeFileSync(
        `${DACS_STORAGE_FOLDER_PATH}/${cid}.json`,
        jsonData,
        'utf-8',
      );

      return cid;
    } catch (_e) {
      throw new BadRequestException('Error when upload file to IPFS');
    }
  }

  async findByCid(cid: string) {
    try {
      const data = fs.readFileSync(
        `${DACS_STORAGE_FOLDER_PATH}/${cid}.json`,
        'utf8',
      );
      return JSON.parse(data);
    } catch (_e) {
      throw new NotFoundException('Not found');
    }
  }
}
