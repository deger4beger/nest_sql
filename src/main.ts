import "dotenv/config"
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './shared/validation.pipe';
import { AuthGuard } from './shared/auth.guard';

const port = process.env.PORT || 3030

async function bootstrap() {
  	const app = await NestFactory.create(AppModule)
  	await app.listen(port)
  	// app.setGlobalPrefix('api/v1')
  	app.useGlobalPipes(new ValidationPipe())
  	app.useGlobalGuards(new AuthGuard())
  	Logger.log(`Server is up and running on http://localhost:${port}`, "Bootstrap")
}
bootstrap()
