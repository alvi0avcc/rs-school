import './sources.css';
import { ISrc } from '../../controller/loader';

export type HtmlElType = HTMLElement | null;

class Sources {
    draw(data: ISrc[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');

        if (!sourceItemTemp) {
            console.error('#sourceItemTemp element not found.');
            return;
        }

        data.forEach((item) => {
            const sourceClone: HTMLElement = sourceItemTemp.content.cloneNode(true) as HTMLElement;

            const sourceItemName: HtmlElType = sourceClone.querySelector('.source__item-name');
            if (sourceItemName && item.name) sourceItemName.textContent = item.name;
            const sourceItem: HtmlElType = sourceClone.querySelector('.source__item');
            if (sourceItem && item.id) sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        const sourceBlock: HtmlElType = document.querySelector('.sources');
        if (sourceBlock) sourceBlock.append(fragment);
    }
}

export default Sources;
