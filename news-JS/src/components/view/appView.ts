import News from './news/news';
import Sources from './sources/sources';
import { IResponse } from '../controller/loader';

// interface INewsArticle {
//     author: string;
//     content: string;
//     description: string;
//     publishedAt: string;
//     source: {
//         id: string;
//         name: string;
//     };
//     title: string;
//     url: string;
//     urlToImage: string;
// }

// export interface INews {
//     articles: INewsArticle[];
//     status: string;
//     totalResults: number;
// }

interface ISource {
    id: string;
    name: string;
    description?: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface ISources {
    sources: ISource[];
    status: string;
}

export class AppView {
    private news: News;
    private sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: IResponse): void {
        console.log('data articles = ',data);
        const values = data?.articles ? data?.articles : [];
        // console.log('drawNews = ',values);
        this.news.draw(values);
    }

    drawSources(data: ISources): void {
        // console.log('drawSources=', data);
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
