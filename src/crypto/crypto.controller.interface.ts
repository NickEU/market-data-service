import { Request, Response, NextFunction, Router } from 'express';

export interface ICryptoController {
	readonly router: Router;
	getLiveTokenData: (req: Request, res: Response, next: NextFunction) => void;
	testLiveMarketDataApi: (req: Request, res: Response, next: NextFunction) => void;
	saveLastCandleDataToDb: (req: Request, res: Response, next: NextFunction) => void;
	findLastCandleRecordsForToken: (req: Request, res: Response, next: NextFunction) => void;
}
