import './sources.css';
import { ISrc } from '../../controller/loader';

export type HtmlElType = HTMLElement | null;

class Sources {
    public draw(data: ISrc[], selector: string): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const sourceItemTemp: HTMLTemplateElement | null = document.querySelector('#sourceItemTemp');

        if (!sourceItemTemp) {
            console.error('#sourceItemTemp element not found.');
            return;
        }

        const nameList: (string | null)[] = data.map((item: ISrc) => item.name?.slice(0, 1) || null);
        const uniqList: Set<string> = new Set(nameList.filter((item: string | null) => item !== null));
        uniqList.forEach((item: string) => {
            const sourceClone: HTMLElement = sourceItemTemp.content.cloneNode(true) as HTMLElement;
            const sourceItemName: HtmlElType = sourceClone.querySelector('.source__item-name');
            if (sourceItemName) sourceItemName.textContent = item;
            const sourceItem: HtmlElType = sourceClone.querySelector('.source__item');
            if (sourceItem) sourceItem.setAttribute('data-source-id', `selector-${item}`);
            fragment.append(sourceClone);
        });

        const selectorBlock: HtmlElType = document.querySelector('.sources.selectors');
        if (selectorBlock) {
            selectorBlock.replaceChildren();
            selectorBlock.append(fragment);
        }

        if (selector === '') selector = data[0].name ? data[0].name.slice(0, 1) : '';

        data.filter((el: ISrc) => (selector === '' ? el : el.name?.slice(0, 1) === selector)).forEach((item: ISrc) => {
            const sourceClone: HTMLElement = sourceItemTemp.content.cloneNode(true) as HTMLElement;

            const sourceItemName: HtmlElType = sourceClone.querySelector('.source__item-name');
            if (sourceItemName && item.name) sourceItemName.textContent = item.name;
            const sourceItem: HtmlElType = sourceClone.querySelector('.source__item');
            if (sourceItem && item.id) sourceItem.setAttribute('data-source-id', item.id);
            fragment.append(sourceClone);
        });

        const sourceBlock: HtmlElType = document.querySelector('.sources.buttons');
        if (sourceBlock) {
            sourceBlock.replaceChildren();
            sourceBlock.append(fragment);
        }
    }
}

export default Sources;
