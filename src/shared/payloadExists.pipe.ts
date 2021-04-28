import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

Injectable()
export class ValidatePayloadExistsPipe implements PipeTransform {
    transform(payload: any): any {
    	if (!Object.keys(payload).length) {
        	throw new BadRequestException('Validation failed: No body submitted')
    	}

    return payload

    }
}