import * as path from 'path';
import * as Express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import HeroRouter from './routes/HeroRoutes';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public app: Express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.app = Express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = Express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.app.use(Express.static('./client/dist'));
        // this.app.use('/node_modules', Express.static('./node_modules'));
        // this.app.use('/', Express.static('view/login.html'));
        this.app.use('/test', HeroRouter);
    }

}

export default new App().app;