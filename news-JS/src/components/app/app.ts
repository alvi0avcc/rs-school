import AppController from '../controller/controller';
import AppView from '../view/appView';
import { IEverything } from '../controller/loader';
import { ISources } from '../controller/loader';

class App {
    private controller: AppController;
    private view: AppView;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        document
            .querySelector('.sources.buttons')
            ?.addEventListener('click', (e: Event) =>
                this.controller.getNews(e, (data: IEverything) => this.view.drawNews(data))
            );

        document.querySelector('.sources.selectors')?.addEventListener('click', (e: Event) => {
            const target: HTMLElement | null = e.target as HTMLElement;
            const element: HTMLElement | null = target?.closest('[data-source-id]');
            if (element) {
                const target: string | undefined | null = element.dataset?.sourceId;
                if (target)
                    if (target.slice(0, -2) === 'selector') {
                        this.controller.getSources((data: ISources) => this.view.drawSources(data, target.slice(-1)));
                    }
            }
        });

        this.controller.getSources((data: ISources) => this.view.drawSources(data, ''));
    }
}

export default App;
