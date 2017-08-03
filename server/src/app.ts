import * as Express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as mongoose from 'mongoose';

import LoginRouter from './routes/login.router';

//  Import/Initialize configuration files and models
import './db/models/user.model';
import './config/passport.config';

/***********************************************************************************************************************
 * EXPRESS APP
 * This file configures the expressjs router, all the routes, passport, and database configurations
 **********************************************************************************************************************/

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
        // passport
        this.app.use(session({
            secret: process.argv[2],
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // mongodb and mongoose
        mongoose.connect('mongodb://localhost/dnd', {
            useMongoClient: true,
            promiseLibrary: global.Promise
        });
    }

    // Configure Express middleware.
    private middleware(): void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        // if the request is not authenticated, redirect to login
        let authenticationRouter = Express.Router();
        authenticationRouter.get('/', (req: Request, res: Response) => {
            if(!req.isAuthenticated()) {
                res.redirect('login');
            }
            else {
                res.redirect('/app');
            }
        });
        this.app.use('/', authenticationRouter);

        // in case of web scan, shutdown
        this.app.use('/login.php', () => {
            process.exit(1);
        });

        //  **************************************** Serve the client files ********************************************
        //  If not logged in, serve the login app
        this.app.use('/login', Express.static('./client/dist/login.html'));
        this.app.use('/login.js', Express.static('./client/dist/login.js'));
        //  If logged in, serve the app
        this.app.use('/app', this.isLoggedIn, Express.static('./client/dist/index.html'));
        this.app.use('/app.js', this.isAuthenticated, Express.static('./client/dist/app.js'));
        //  Common files and libraries
        this.app.use('/vendor.js', Express.static('./client/dist/vendor.js'));
        this.app.use('/polyfills.js', Express.static('./client/dist/polyfills.js'));
        this.app.use('/node_modules', Express.static('./node_modules'));

        // ********************************************** API **********************************************************
        this.app.use('/auth', LoginRouter);
    }

    private isLoggedIn(req: Request, res: Response, next: NextFunction): void {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }

    private isAuthenticated(req: Request, res: Response, next: NextFunction): void {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.sendStatus(401);
        }
    }
}

export default new App().app;