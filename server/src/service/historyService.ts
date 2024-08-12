import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { v4 as uuid4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

 export class HistoryService {
  private filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json');
  private lock = false;

  private async read(): Promise<City[]> {
    try {
      console.log(this.filePath)
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        console.error('Error reading file:', error);
        throw error;
      }
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities));
    } catch (error) {
      console.error('Error writing to file:', error);
      throw error;
    }
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string): Promise<void> {
    try {
      if (this.lock) {
        throw new Error('Concurrent access detected');
      }
      this.lock = true;
      const cities = await this.read();
      const newCity = new City(cityName, uuid4());
      cities.push(newCity);
      await this.write(cities);
      this.lock = false;
    } catch (error) {
      console.error('Error adding city:', error);
      throw error;
    }
  }

  async removeCity(id: string): Promise<void> {
    try {
      if (this.lock) {
        throw new Error('Concurrent access detected');
      }
      this.lock = true;
      const cities = await this.read();
      const index = cities.findIndex((city) => city.id === id);
      if (index !== -1) {
        cities.splice(index, 1);
        await this.write(cities);
      }
      this.lock = false;
    } catch (error) {
      console.error('Error removing city:', error);
      throw error;
    }
  }
}

export default new HistoryService();