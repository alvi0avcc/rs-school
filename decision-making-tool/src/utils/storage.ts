interface Option {
  id: number;
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
      id: 0,
      title: '',
      weight: undefined,
    };
    this.list = {
      listOptions: [this.defaultList],
      lastId: 0,
    };
  }

  public static async getStorage(
    key: string
  ): Promise<string | undefined> {
    return new Promise((resolve) => {
      const value =
        localStorage.getItem(key);
      console.log(
        'storageGet =',
        value
      );

      resolve(
        value === null
          ? undefined
          : value
      );
    });
  }

  public static setStorage(
    key: string,
    value: string
  ): void {
    localStorage.setItem(key, value);
  }

  public saveStorageToFile(): void {
    const blob = new Blob(
      [JSON.stringify(this.list)],
      { type: 'application/json' }
    );
    const url =
      URL.createObjectURL(blob);
    const a =
      document.createElement('a');
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
    Storage.setStorage(
      this.defaultKeyList,
      JSON.stringify(this.list)
    );
  }

  public async init(): Promise<
    boolean[]
  > {
    const results = await Promise.all([
      this.getStorageList(),
      this.getStorageList(),
    ]);
    return results;
  }

  private setStorageList(): void {
    Storage.setStorage(
      this.defaultKeyList,
      JSON.stringify(this.list)
    );
  }

  private async getStorageList(): Promise<boolean> {
    try {
      const response:
        | string
        | undefined =
        await Storage.getStorage(
          this.defaultKeyList
        );
      if (response) {
        this.list =
          JSON.parse(response);
        console.log(
          'list =',
          this.list
        );
      } else {
        this.list.lastId = 1;
        this.setStorageList();
      }
      return true;
    } catch (error) {
      console.error(
        'Error fetching storage:',
        error
      );
      return false;
    }
  }
}
