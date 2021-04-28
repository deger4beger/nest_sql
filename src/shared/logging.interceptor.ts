import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		call$: CallHandler<any>
	): any { // was : Observable<any> because not working with just return call
		const req = context.switchToHttp().getRequest()
		if (!req) {
			return call$
		}
		const { method, url } = req
		const now = Date.now()

		return call$.handle().pipe(
			tap(() =>
				Logger.log(
					`${method} ${url} ${Date.now() - now}ms`,
					context.getClass().name
				)
			)
		)
	}
}