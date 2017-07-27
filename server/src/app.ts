import * as path from 'path';
import * as Express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import HeroRouter from './routes/HeroRoutes';
import LoginRouter from './routes/login.router';

import './config/passport.config';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public app: Express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.app = Express();
        this.config();
        this.middleware();
        this.routes();
    }

    private config(): void {
        this.app.use(session({
            secret: process.argv[2],
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
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
        // if the request is not authenticated, redirect to login
        // let authenticationRouter = Express.Router();
        // authenticationRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
        //     if(!req.isAuthenticated()) {
        //         res.redirect('login');
        //     }
        //     else {
        //         res.redirect('/');
        //     }
        // });
        // this.app.use('/', authenticationRouter);

        //  Serve the client files
        this.app.use(Express.static('./client/dist'));
        this.app.use('/login', Express.static('./client/dist/index.html'));
        this.app.use('/node_modules', Express.static('./node_modules'));

        // in case of web scan, shutdown
        this.app.use('/login.php', () => {
            process.exit(1);
        });

        // api routes
        this.app.use('/auth', LoginRouter);
        this.app.use('/test', this.isLoggedIn, HeroRouter);
    }

    private isLoggedIn(req: Request, res: Response, next: NextFunction): void {
        if (req.isAuthenticated()) {
            next();
        }

        res.redirect('/login');
    }

    private isAuthnticated(req: Request, res: Response, next: NextFunction): void {
        if (req.isAuthenticated()) {
            next();
        }

        res.sendStatus(401);
    }
}

export default new App().app;