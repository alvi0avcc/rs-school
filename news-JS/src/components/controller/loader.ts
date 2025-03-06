export interface IEverything {
    status?: string | null;
    totalResults?: number | null;
    articles?: IArticle[] | [] | null;
}

export interface IArticle {
    author?: string | null;
    content?: string | null;
    description?: string | null;
    publishedAt?: string | null;
    source?: {
        id?: string | null;
        name?: string | null;
    } | null;
    title?: string | null;
    url?: string | null;
    urlToImage?: string | null;
}

export interface ISources {
    status?: string | null;
    sources?: ISrc[] | [] | null;
}

export interface ISrc {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    url?: string | null;
    category?: string | null;
    language?: string | null;
    country?: string | null;
}

type Options = Record<string, string>;
class Loader {
    private baseLink: Readonly<string> | undefined;
    private options: Readonly<Options> | undefined;
    constructor(baseLink: string | undefined, options: Options | undefined) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(
        { endpoint, options }: { endpoint: string; options?: Options },
        callback: (data: T) => void = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: Options, endpoint: string): string | null {
        if (!this.baseLink || !this.options) return null;

        const urlOptions: Options = { ...this.options, ...options };
        let url: string = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key: string) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    private load<T>(method: string, endpoint: string, callback: (data: T) => void, options: Options = {}): void {
        const url: string | null = this.makeUrl(options, endpoint);
        if (url) {
            fetch(url, { method })
                .then(this.errorHandler)
                .then((res: Response) => res.json())
                .then((data: T) => {
                    callback(data);
                })
                .catch((err: Error) => console.error(err));
        } else console.error('.env file not found or incorrect');
    }
}

export default Loader;
