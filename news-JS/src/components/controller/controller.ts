import AppLoader from './appLoader';
import { IEverything } from './loader';
import { ISources } from './loader';

class AppController extends AppLoader {
    public getSources(callback: (data: ISources) => void): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            (data: IEverything | ISources) => callback(data as ISources)
        );
    }

    public getNews(e: Event, callback: (data: IEverything) => void): void {
        let target: HTMLElement | null = e.target as HTMLElement;
        const newsContainer: HTMLElement | null = e.currentTarget as HTMLElement;

        if (target && newsContainer)
            while (target !== newsContainer) {
                if (target?.classList.contains('source__item')) {
                    const sourceId: string | null = target.getAttribute('data-source-id');
                    if (newsContainer?.getAttribute('data-source') !== sourceId) {
                        newsContainer.setAttribute('data-source', sourceId || '');
                        super.getResp(
                            {
                                endpoint: 'everything',
                                options: {
                                    sources: sourceId || '',
                                },
                            },
                            (data: IEverything | ISources) => callback(data as IEverything)
                        );
                    }
                    return;
                }
                target = target.parentNode as HTMLElement;
            }
    }
}

export default AppController;
