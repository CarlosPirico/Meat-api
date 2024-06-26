import * as restify from 'restify';
import * as mongoose from 'mongoose'

import { environment } from '../common/environment';
import { Router } from '../common/router';

export class Server {

    application: restify.Server;

    async initializeDb(): Promise<any> {
        (<any>mongoose).Promise = global.Promise
        return await mongoose.connect(environment.db.url)
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());

                //Router
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application);
                })
            }catch(error){
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(()=>
               this.initRoutes(routers).then(()=> this))
    }
}