import * as Express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

//  Import/Initialize configuration files and models
import './db/models/user.model';
import './db/models/ruleSet.model';
import './db/models/characterSheet.model';
import './db/models/characterAspect.model';
import './db/models/user-ruleSet.model';
import './db/models/character.model';
import './db/models/notification.model';
import './db/models/friend.model';
import './db/models/campaign.model';
import './db/models/encounter.model';
import './db/models/user-campaign.model';
import './db/models/player.model';
import './db/models/notation.model';
import './config/passport.config';

import LoginRouter from './routes/login.router';
import UserRouter from './routes/user.router';
import RuleSetRouter from './routes/ruleSet.router';
import SocialRouter from './routes/social.router';
import CampaignRouter from './routes/campaign.router';
import EncounterRouter from './routes/encounter.router';
import NotificationRouter from './routes/notification.router';
import CharacterRouter from './routes/character.router';
import { MqProxy, MqProxySingleton } from './mq/mqProxy';
import { MqServiceSingleton } from './mq/mq.service';

/***********************************************************************************************************************
 * EXPRESS APP
 * This file configures the expressjs router, all the routes, passport, and database configurations
 **********************************************************************************************************************/

class App {
  // ref toUserId Express instance
  public app;
  private mqProxy: MqProxy;

  //Run configuration methods on the Express instance.
  constructor() {
    this.app = Express();
    this.config().then(() => {
	    this.middleware();
	    this.routes();
	    this.handleMqMessages();
    });
  }

  private async config(): Promise<void> {
    // passport
    this.app.use(session({
      secret: process.argv[ 2 ],
      resave: true,
      saveUninitialized: true
    }));

    // mongodb and mongoose
    await mongoose.connect('mongodb://localhost/ex2', {
      promiseLibrary: bluebird
    });

    this.mqProxy = MqProxySingleton;
    await this.mqProxy.connect();

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  // Configure Express middleware.
  private middleware(): void {
    this.app.use(favicon('./dist/client/resources/images/favicon.ico'));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json({limit: '50mb'}));
    this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  }

  // Configure API endpoints.
  private routes(): void {
    // if the request is not authenticated, redirect toUserId login
    let authenticationRouter = Express.Router();
    authenticationRouter.get('/', (req: Request, res: Response) => {
      if (!req.isAuthenticated()) {
      	res.redirect('login');
      }
      else {
        res.sendFile(path.resolve('./dist/client/index.html'))
      }
    });
    this.app.use('/', authenticationRouter);

    //  **************************************** Serve the client files ********************************************
    //  If not logged in, serve the login app
    this.app.use('/login', Express.static('./dist/client/login.html'));
    this.app.use('/static', Express.static('./dist/client'));
    this.app.use('/resources', Express.static('./dist/client/resources'));
    // this.app.use('/static/resources', Express.static('./client/dist/resources'));
    //  If logged in, serve the app
    // this.app.use('/static/app.js', this.isAuthenticated, Express.static('./client/dist/app.js'));


    // ********************************************** API **********************************************************
    this.app.use('/auth', LoginRouter);
    this.app.use('/api/user', this.isAuthenticated, UserRouter);
    this.app.use('/api/social', this.isAuthenticated, SocialRouter);
	  this.app.use('/api/ruleset', this.isAuthenticated, RuleSetRouter);
	  this.app.use('/api/campaign', this.isAuthenticated, CampaignRouter);
    this.app.use('/api/encounter', this.isAuthenticated, EncounterRouter);
	  this.app.use('/api/character', this.isAuthenticated, CharacterRouter);
	  this.app.use('/api/notification', this.isAuthenticated, NotificationRouter);

    //  All other requests, redirect toUserId index
    this.app.get('*', (req, res) => {
      res.status(404).send().redirect('/');
    });
  }

  private handleMqMessages(): void {
  	MqServiceSingleton.handleMessages();
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