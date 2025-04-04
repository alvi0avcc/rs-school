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

export interface EngineParameter {
  velocity: number;
  distance: number;
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

export const createCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
};

export const deleteCar = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Car not found');
};

export const getCar = async (id: number): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'GET',
  });
  return response.json();
};

export const updateCar = async (id: number, car: Omit<Car, 'id'>): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
};

export const controlEngine = async (
  id: number,
  status: EngineStatus
): Promise<EngineParameter | { success: boolean }> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=${status}`, {
    method: 'PATCH',
  });

  if (!response.ok) return { success: false };

  return response.json();
};
