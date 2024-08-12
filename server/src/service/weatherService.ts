import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface WeatherDataResponse {
  list: {
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

export class WeatherService {
  private baseURL = 'https://api.openweathermap.org';
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private city: string;

  constructor(city: string = 'Default city') {
    this.city = city;
  }

  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.status}`);
    }
    return response.json();
  }

  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('Location data is empty');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  private buildGeocodeQuery(): string {
    return `${this.city}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?q=${this.city}&lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(`${query}`);
    return response.json();
  }

  private parseCurrentWeather(response: any): Weather {
    const { main, weather } = response.list[0];
    const { temp, humidity } = main;
    const { description, icon } = weather[0];
    return {
      temperature: temp,
      humidity,
      windSpeed: response.list[0].wind.speed,
      description,
      icon,
    };
  }

  private buildForecastArray(_currentWeather: Weather, weatherData: WeatherDataResponse): Weather[] {
    const forecast = [];
    for (let i = 1; i < weatherData.list.length; i += 8) {
      const { main, wind, weather } = weatherData.list[i];
      const { temp, humidity } = main;
      const { description, icon } = weather[0];
      forecast.push({
        temperature: temp,
        humidity,
        windSpeed: wind.speed,
        description,
        icon,
      });
    }
    return forecast;
  }

  async getWeatherForCity(cityName: string): Promise<{ current: Weather; forecast: Weather[] }> {
    this.city = cityName;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData);
    return { current: currentWeather, forecast };
  }
}

export default new WeatherService('Default City');
