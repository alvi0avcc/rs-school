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
            .querySelector('.sources')
            ?.addEventListener('click', (e: Event) =>
                this.controller.getNews(e, (data: IEverything) => this.view.drawNews(data))
            );

        this.controller.getSources((data: ISources) => this.view.drawSources(data));
    }
}

export default App;
