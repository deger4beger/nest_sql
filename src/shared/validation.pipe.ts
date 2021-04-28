import { BadRequestException, Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpStatus,
  ValidationError
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (value instanceof Object && this.isEmpty(value)) {
          throw new BadRequestException(
            'Validation failed: No body submitted'
          )
        }
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
          return value;
        }
        const object = plainToClass(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            throw new BadRequestException(
                // `Validation failed: ${this.formatErrors(errors)}`
                this.formatErrors(errors)
            )
        }
        return value
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object]
        return !types.find(type => metatype === type)
    }

    private formatErrors(errors: ValidationError[]) {
        return errors.map(err => {
            for (const property in err.constraints) {
                if (err.constraints.hasOwnProperty(property)) {
                    return {
                        path: err.property,
                        message: err.constraints[property],
                    }
                }
            }
        })
    }

    private isEmpty(value: any) {
        if (Object.keys(value).length > 0) {
            return false;
        }
        return true;
    }
}