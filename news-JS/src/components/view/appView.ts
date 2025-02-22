import News from './news/news';
import Sources from './sources/sources';
import { IArticle, IEverything, ISrc } from '../controller/loader';
import { ISources } from '../controller/loader';

export class AppView {
    private news: News;
    private sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: IEverything): void {
        const values: IArticle[] = data?.articles || [];
        this.news.draw(values);
    }

    public drawSources(data: ISources, selector: string): void {
        const values: ISrc[] = data?.sources || [];
        this.sources.draw(values, selector);
    }
}

export default AppView;
