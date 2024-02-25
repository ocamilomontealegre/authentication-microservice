import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import axios from 'axios';

@Injectable()
export class HttpServices {
  // Process post request to own or third-party services
  async postData(url: string, body: object): Promise<User | object> {
    try {
      const result = await axios.post(url, body);
      return result.data;
    } catch (err) {
      throw new Error(`Failed to fetch users: ${err.message}`);
    }
  }

  // Process get request to own or third-party services
  async getData(url: string): Promise<User | object> {
    try {
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      throw new Error(`Failed to fetch users: ${err.message}`);
    }
  }
}
