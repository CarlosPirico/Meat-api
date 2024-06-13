import * as restify from 'restify';
import { environment } from '../common/environment';

export class Server {

    application: restify.Server;

    initRoutes(): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                
                this.application.use(restify.plugins.queryParser())

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application);
                })

                this.application.get('/info', (req, resp, next)=>{
                    //resp.contentType = 'application/json';
                    //resp.status(400);
                    // resp.setHeader('contentType', 'application/json');
                    //resp.send({message: 'hello'});
                    resp.json({
                        browser: req.userAgent(),
                        method: req.method,
                        url: req.url,
                        url1: req.href(),
                        path: req.path(),
                        query: req.query
                    })
                    return next();
                })
            }catch(error){
                reject(error)
            }
        })
    }

    bootstrap(): Promise<Server>{
        return this.initRoutes().then(()=> this)
    }
}