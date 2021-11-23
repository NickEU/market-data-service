import { Request, Response, NextFunction, Router } from 'express';

export interface IUserController {
	readonly router: Router;
	register: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
}
