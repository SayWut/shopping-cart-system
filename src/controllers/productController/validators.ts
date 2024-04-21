import { IsInt, Min, Max, IsNumber, IsDate, IsDateString } from 'class-validator';

export class CreateProductBody {
    @IsInt()
    @Min(10000000)
    @Max(99999999)
    sku!: number;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsInt()
    @Min(1)
    quantity!: number;

    @IsDateString()
    expirationDate!: string;
}