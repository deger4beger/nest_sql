import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const request = ctx.getRequest()
		const response = ctx.getResponse()
		const status = exception.getStatus()
		const errorResponse = {
			code: status,
			timastamp: new Date().toLocaleDateString(),
			path: request.url,
			method: request.method,
			error: status === HttpStatus.BAD_REQUEST ? (
				exception.response.message ) : (
				exception.message )
		}

		Logger.error(
			`${request.method} ${request.url}`,
			JSON.stringify(errorResponse),
			"ExceptionFilter"
		)

		response.status(status).json(errorResponse)
	}
}