import { IsInt, Min, Max } from 'class-validator';

export class AddProductBody {
    @IsInt()
    @Min(10000000)
    @Max(99999999)
    sku!: number;

    @IsInt()
    @Min(1)
    quantity!: number
}

export class RemoveProductBody {
    @IsInt()
    @Min(10000000)
    @Max(99999999)
    sku!: number;
}