import { Request, Response, NextFunction, Router } from 'express';

export interface ICryptoController {
	readonly router: Router;
	getLiveTokenDataFromExternalApi: (req: Request, res: Response, next: NextFunction) => void;
}
