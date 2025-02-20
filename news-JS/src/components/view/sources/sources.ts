import './sources.css';
import { ISrc } from '../../controller/loader';

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

            const sourceItemName: HTMLElement | null = sourceClone.querySelector('.source__item-name');
            if (sourceItemName) sourceItemName.textContent = item.name;
            const sourceItem: HTMLElement | null = sourceClone.querySelector('.source__item');
            if (sourceItem) sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        const sourceBlock: HTMLElement | null = document.querySelector('.sources');
        if (sourceBlock) sourceBlock.append(fragment);
    }
}

export default Sources;
