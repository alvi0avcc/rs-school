import News from './news/news';
import Sources from './sources/sources';
import { IEverything } from '../controller/loader';
import { ISources } from '../controller/loader';

export class AppView {
    private news: News;
    private sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: IEverything): void {
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
