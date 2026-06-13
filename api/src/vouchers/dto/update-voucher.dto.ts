import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsBoolean,
  IsDateString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DiscountType } from '../../generated/prisma/client.js';

@ValidatorConstraint({ name: 'updateEndDateGreaterThanStartDate', async: false })
export class UpdateEndDateGreaterThanStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: string, args: ValidationArguments) {
    const object = args.object as any;
    // Only validate if both dates are provided in the update payload
    if (!object.startDate || !endDate) return true;
    return new Date(endDate) > new Date(object.startDate);
  }

  defaultMessage() {
    return 'endDate must be greater than startDate';
  }
}

@ValidatorConstraint({ name: 'updateMaxDiscountPercentage', async: false })
export class UpdateMaxDiscountPercentageConstraint
  implements ValidatorConstraintInterface
{
  validate(value: number, args: ValidationArguments) {
    const object = args.object as any;
    if (object.discountType === DiscountType.PERCENTAGE) {
      return value <= 100;
    }
    return true;
  }

  defaultMessage() {
    return 'Discount percentage cannot be more than 100';
  }
}

export class UpdateVoucherDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Validate(UpdateMaxDiscountPercentageConstraint)
  discountValue?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDiscount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minPurchase?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Quota must be at least 1' })
  quota?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  userLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  @Validate(UpdateEndDateGreaterThanStartDateConstraint)
  endDate?: string;
}
