// TODO: Define a City class with name and id properties
import { promises as fs } from 'fs';
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const data = await fs.readFile('searchHistory.json', 'utf8');
    return JSON.parse(data).map((cityData: { name: string; id: string }) => new City(cityData.name, cityData.id));
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities.map((city) => ({ name: city.name, id: city.id })));
    await fs.writeFile('searchHistory.json', data);
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: City): Promise<void> {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const index = cities.findIndex((city) => city.id === id);
    if (index !== -1) {
      cities.splice(index, 1);
      await this.write(cities);
    }
  }
}

export default new HistoryService();
