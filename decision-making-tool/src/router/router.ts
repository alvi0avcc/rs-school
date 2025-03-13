export default class Router {
  private onHashChange: (hash: string) => void;

  constructor(onHashChange: (hash: string) => void) {
    this.onHashChange = onHashChange;
    this.init();
  }

  private init(): void {
    globalThis.addEventListener('hashchange', (): void => this.handleRouting());
    globalThis.addEventListener('load', (): void => this.handleRouting());
  }

  private handleRouting(): void {
    const currentHash = globalThis.location.hash.slice(1) || '/';
    console.log('currentHash=', currentHash);

    try {
      this.onHashChange(currentHash);
    } catch (error) {
      console.error('Error in onHashChange:', error);
    }
  }
}
