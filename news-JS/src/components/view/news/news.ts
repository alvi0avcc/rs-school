import './news.css';
import { IArticle } from '../../controller/loader';
import { HtmlElType } from '../sources/sources';

class News {
    public draw(data: IArticle[]): void {
        const news: IArticle[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const newsItemTemp: HTMLTemplateElement | null = document.querySelector('#newsItemTemp');

        if (!newsItemTemp) {
            console.error('#newsItemTemp element not found.');
            return;
        }

        news.forEach((item: IArticle, idx: number) => {
            const newsClone: HTMLElement = newsItemTemp.content.cloneNode(true) as HTMLElement;

            if (idx % 2) newsClone.querySelector('.news__item')?.classList.add('alt');

            const metaPhoto: HtmlElType = newsClone.querySelector('.news__meta-photo');
            if (metaPhoto) metaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
            const metaAuthor: HtmlElType = newsClone.querySelector('.news__meta-author');
            if (metaAuthor) metaAuthor.textContent = item.author || item.source?.name || '';
            const metaDate: HtmlElType = newsClone.querySelector('.news__meta-date');
            if (metaDate && item.publishedAt)
                metaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');
            const descrTitle: HtmlElType = newsClone.querySelector('.news__description-title');
            if (descrTitle) descrTitle.textContent = item.title || '';
            const descrSourse: HtmlElType = newsClone.querySelector('.news__description-source');
            if (descrSourse) descrSourse.textContent = item.source?.name || '';
            const descrContent: HtmlElType = newsClone.querySelector('.news__description-content');
            if (descrContent) descrContent.textContent = item.description || '';
            const readMore: HtmlElType = newsClone.querySelector('.news__read-more a');
            if (readMore) readMore.setAttribute('href', item.url || '');

            fragment.append(newsClone);
        });

        const newsBlock: HTMLElement | null = document.querySelector('.news');
        if (newsBlock) {
            newsBlock.innerHTML = '';
            newsBlock.appendChild(fragment);
        }
    }
}

export default News;
