import { BaseController } from "../common/base.controller";
import { Request, Response, NextFunction, Router } from 'express';
import { LoggerService } from "../logger/logger.service";
import { HTTPError } from "../errors/http-error.class";

export class UserController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            { path: '/login', func: this.login, method: 'post' },
            { path: '/register', func: this.register, method: 'post' },
        ]);
    }

    register(_req: Request, res: Response, _next: NextFunction) {
        this.ok(res, "Registration successful");
    }

    login(_req: Request, _res: Response, next: NextFunction) {
        next(new HTTPError(401, 'Authorization error!', 'login'));
    }
}