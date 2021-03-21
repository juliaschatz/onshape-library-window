export interface Configuration {
  id: string;
  name: string;
  type: "QUANTITY" | "BOOLEAN" | "ENUM" | "STRING";
  default: any;
  quantityMax?: number;
  quantityMin?: number;
  quantityType?: "LENGTH" | "ANGLE" | "INTEGER" | "REAL";
  quantityUnits?: string;
  options?: {name: string; value: string;}[];
}