import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super(process.env.API_URL as Readonly<string>, {
            apiKey: process.env.API_KEY as Readonly<string>,
        });
    }
}

export default AppLoader;
