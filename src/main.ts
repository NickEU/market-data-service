import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { Container, interfaces, ContainerModule } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUserController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { UserService } from './users/users.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';
import { ICryptoController } from './crypto/crypto.controller.interface';
import { CryptoController } from './crypto/crypto.controller';
import { TokenMarketDataService } from './crypto/token.market.data.service';
import { ITokenMarketDataService } from './crypto/token.market.data.service.interface';
import { ITokenMarketDataRepository } from './crypto/token.market.data.repository.interface';
import { TokenMarketDataRepository } from './crypto/token.market.data.repository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	// Misc
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
	// Controllers
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<ICryptoController>(TYPES.ICryptoController).to(CryptoController);
	// Services
	bind<ITokenMarketDataService>(TYPES.ITokenMarketDataService).to(TokenMarketDataService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	// Repositories
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
	bind<ITokenMarketDataRepository>(TYPES.ITokenMarketDataRepository)
		.to(TokenMarketDataRepository)
		.inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

export interface BootstrapReturn {
	appContainer: Container;
	app: App;
}

async function bootstrap(): Promise<BootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
