export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Engine {
  velocity: number;
  distance: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface QueryParameters {
  _page?: number;
  _limit?: number;
  _sort?: 'id' | 'wins' | 'time';
  _order?: 'ASC' | 'DESC';
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

const BASE_URL = 'http://127.0.0.1:3000';

export const getGarage = async (
  parameters?: QueryParameters
): Promise<{ cars: Car[]; totalCount: number }> => {
  const queryParameters = new URLSearchParams();

  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
  }

  const queryString = queryParameters.toString();
  const url = `${BASE_URL}/garage${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const totalCountHeader = response.headers.get('X-Total-Count');
  const totalCount = totalCountHeader ? Number.parseInt(totalCountHeader, 10) : 0;

  const cars: Car[] = await response.json();
  if (!Array.isArray(cars)) {
    throw new TypeError('Error: expected array of cars');
  }

  return { cars, totalCount };
};
