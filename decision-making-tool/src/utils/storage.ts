export interface Option {
  id: string;
  title: string;
  weight: number | undefined;
}

export interface List {
  listOptions: Option[];
  lastId: number;
}

export class Storage {
  private list: List;
  private defaultList: Option;
  private defaultKeyList: string;
  // private defaultKeySound: string;

  constructor() {
    this.defaultKeyList = 'option-list';
    // this.defaultKeySound = 'sound';

    this.defaultList = {
      id: '#1',
      title: '',
      weight: undefined,
    };
    this.list = {
      listOptions: [this.defaultList],
      lastId: 1,
    };
  }

  public static async getStorage(key: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      const value = localStorage.getItem(key);

      resolve(value === null ? undefined : value);
    });
  }

  public static setStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public static pasteOption(text: string): [string, number | undefined][] {
    const textLines: string[] = text.split('\n');
    const options: [string, number | undefined][] = [];
    for (const line of textLines) {
      const lastCommaIndex: number = line.lastIndexOf(',');

      let firstPart: string = line;
      let secondPart = undefined;

      if (lastCommaIndex === -1) {
        if (firstPart.length > 0) options.push([firstPart, undefined]);
      } else {
        firstPart = line.slice(0, lastCommaIndex).trim();
        secondPart = line.slice(lastCommaIndex + 1).trim();
        if (firstPart.length > 0 || secondPart.length > 0) {
          options.push([firstPart, Number(secondPart) || undefined]);
        }
      }
    }
    return options;
  }

  public saveStorageToFile(): void {
    const blob = new Blob([JSON.stringify(this.list)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  public getList(): List {
    return this.list;
  }

  public setList(list: List): void {
    this.list = list;
    Storage.setStorage(this.defaultKeyList, JSON.stringify(this.list));
  }

  public async init(): Promise<boolean[]> {
    //TODO implement sound and replace "true" to this.getSoundState()
    const results = await Promise.all([this.getStorageList(), true]);
    return results;
  }

  private setStorageList(): void {
    Storage.setStorage(this.defaultKeyList, JSON.stringify(this.list));
  }

  private async getStorageList(): Promise<boolean> {
    try {
      const response: string | undefined = await Storage.getStorage(this.defaultKeyList);
      this.list = this.isListGuard(response);
      return true;
    } catch (error) {
      console.error('Error fetching storage:', error);
      return false;
    }
  }

  private isListGuard(data: string | undefined): List {
    const defaultList: List = { lastId: 1, listOptions: [] };

    if (!data) {
      this.setStorageList();
      return defaultList;
    }

    try {
      const parsed: unknown = JSON.parse(data);

      if (isList(parsed)) {
        return parsed;
      } else {
        console.error('The data does not match the List type.');
        this.setStorageList();
        return defaultList;
      }
    } catch (error) {
      console.error('Error while parsing data:', error);
      this.setStorageList();
      return defaultList;
    }
  }
}

function isOption(data: unknown): data is Option {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return (
    'id' in data &&
    typeof data.id === 'string' &&
    'title' in data &&
    typeof data.title === 'string' &&
    'weight' in data &&
    (typeof data.weight === 'number' || data.weight === undefined)
  );
}

function isList(data: unknown): data is List {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return (
    'lastId' in data &&
    typeof data.lastId === 'number' &&
    'listOptions' in data &&
    Array.isArray(data.listOptions) &&
    data.listOptions.every((item) => isOption(item))
  );
}
