import './sources.css';
import { ISrc } from '../../controller/loader';

export type HtmlElType = HTMLElement | null;

class Sources {
    draw(data: ISrc[]): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const sourceItemTemp: HTMLTemplateElement | null = document.querySelector('#sourceItemTemp');

        if (!sourceItemTemp) {
            console.error('#sourceItemTemp element not found.');
            return;
        }

        // console.log('source data = ', data);
        const nameList: (string | null)[] = data.map((item: ISrc) => item.name?.slice(0, 1) || null);
        const uniqList: Set<string> = new Set(nameList.filter((item: string | null) => item !== null));
        // console.log('name list = ', nameList);
        console.log('name uniq list = ', uniqList);
        uniqList.forEach((item: string) => {
            const sourceClone: HTMLElement = sourceItemTemp.content.cloneNode(true) as HTMLElement;
            const sourceItemName: HtmlElType = sourceClone.querySelector('.source__item-name');
            if (sourceItemName) sourceItemName.textContent = item;
            const sourceItem: HtmlElType = sourceClone.querySelector('.source__item');
            if (sourceItem) sourceItem.setAttribute('data-source-id', `selector-${item}`);
            fragment.append(sourceClone);
        });

        const selectorBlock: HtmlElType = document.querySelector('.sources.selectors');
        if (selectorBlock) selectorBlock.append(fragment);

        data.forEach((item: ISrc) => {
            const sourceClone: HTMLElement = sourceItemTemp.content.cloneNode(true) as HTMLElement;

            const sourceItemName: HtmlElType = sourceClone.querySelector('.source__item-name');
            if (sourceItemName && item.name) sourceItemName.textContent = item.name;
            const sourceItem: HtmlElType = sourceClone.querySelector('.source__item');
            if (sourceItem && item.id) sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        const sourceBlock: HtmlElType = document.querySelector('.sources.buttons');
        if (sourceBlock) sourceBlock.append(fragment);
    }
}

export default Sources;
