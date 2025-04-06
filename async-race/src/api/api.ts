const BASE_URL = 'http://127.0.0.1:3000';
export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Engine {
  velocity: number;
  distance: number;
}
export interface EngineParameter {
  velocity: number;
  distance: number;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

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
): Promise<EngineParameter | { success: false }> => {
  try {
    const response = await fetch(`${BASE_URL}/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    }

    if (status === 'drive' && response.status === 500) {
      return { success: false };
    }

    return { success: false };
  } catch {
    return { success: false };
  }
};

export const getWinners = async (
  parameters?: QueryParameters
): Promise<{ winners: Winner[]; totalCount: number }> => {
  const queryParameters = new URLSearchParams();

  if (parameters) {
    if (parameters._page) queryParameters.append('_page', parameters._page.toString());
    if (parameters._limit) queryParameters.append('_limit', parameters._limit.toString());
    if (parameters._sort) queryParameters.append('_sort', parameters._sort);
    if (parameters._order) queryParameters.append('_order', parameters._order);
  }

  const queryString = queryParameters.toString();
  const url = `${BASE_URL}/winners${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch winners: ${response.statusText}`);
  }

  const totalCountHeader = response.headers.get('X-Total-Count');
  const totalCount = totalCountHeader ? Number.parseInt(totalCountHeader, 10) : 0;

  const winners: unknown = await response.json();

  if (!Array.isArray(winners)) {
    throw new TypeError('Invalid winners data format');
  }

  return {
    winners: validatedWinners(winners),
    totalCount,
  };
};

const validatedWinners = (winners: Winner[]): Winner[] =>
  winners.map((winner) => {
    if (
      typeof winner === 'object' &&
      winner !== null &&
      'id' in winner &&
      'wins' in winner &&
      'time' in winner
    ) {
      return {
        id: Number(winner.id),
        wins: Number(winner.wins),
        time: Number(winner.time),
      };
    }
    throw new Error('Invalid winner structure');
  });
