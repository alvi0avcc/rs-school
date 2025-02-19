import AppLoader from './appLoader';
import { IEverything } from './loader';
import { ISources } from './loader';

class AppController extends AppLoader {
    getSources(callback: (data: ISources) => void): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            (data: IEverything | ISources) => {
                callback(data as ISources)
            }
        );
    }

    getNews(e: Event, callback: (data: IEverything) => void): void {
        let target = e.target as HTMLElement;
        const newsContainer = e.currentTarget as HTMLElement;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId: string | null = target.getAttribute('data-source-id');
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId || '');
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId || '',
                            },
                        },
                        (data: IEverything | ISources) => {
                            callback(data as IEverything)
                        }
                    );
                }
                return;
            }
            target = target.parentNode as HTMLElement;
        }
    }
}

export default AppController;
