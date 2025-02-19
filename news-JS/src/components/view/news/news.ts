import './news.css';
import { IArticle } from '../../controller/loader';

class News {
    draw(data: IArticle[]): void {
        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector<HTMLTemplateElement>('#newsItemTemp');

        if (!newsItemTemp) {
            console.error('#newsItemTemp element not found.');
            return;
        }

        news.forEach((item, idx) => {
            const newsClone: HTMLElement = newsItemTemp.content.cloneNode(true) as HTMLElement;

            if (idx % 2) newsClone.querySelector('.news__item')?.classList.add('alt');

            const metaPhoto: HTMLElement | null = newsClone.querySelector('.news__meta-photo');
            if (metaPhoto)
                metaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
            const metaAuthor: HTMLElement | null = newsClone.querySelector('.news__meta-author');
            if (metaAuthor)
                metaAuthor.textContent = item.author || item.source.name;
            const metaDate : HTMLElement | null = newsClone.querySelector('.news__meta-date');
            if (metaDate)
                metaDate.textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');
            const descrTitle: HTMLElement | null = newsClone.querySelector('.news__description-title');
            if (descrTitle)
                descrTitle.textContent = item.title;
            const descrSourse: HTMLElement | null = newsClone.querySelector('.news__description-source');
            if (descrSourse)
                descrSourse.textContent = item.source.name;
            const descrContent: HTMLElement | null = newsClone.querySelector('.news__description-content');
            if (descrContent)
                descrContent.textContent = item.description;
            const readMore: HTMLElement | null = newsClone.querySelector('.news__read-more a');
            if (readMore)
                readMore.setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const newsBlock:  HTMLElement | null = document.querySelector('.news');
        if (newsBlock) {
            newsBlock.innerHTML = '';
            newsBlock.appendChild(fragment);
        }
    }
}

export default News;
