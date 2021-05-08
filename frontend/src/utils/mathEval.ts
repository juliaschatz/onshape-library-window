import { stringify } from "querystring";


export class NumberWithUnits {
  val: number;
  length: number;
  angle: number;

  constructor(val: number, length?: number, angle?: number) {
    this.val = val;
    this.length = length || 0;
    this.angle = angle || 0;
  }

  hasSameUnitsAs(other: NumberWithUnits): boolean {
    return this.length === other.length && this.angle === other.angle;
  }

  eq(other: NumberWithUnits): boolean {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot compare equality with different units");
    }
    return this.val === other.val;
  }

  lt(other: NumberWithUnits): boolean {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot compare order with different units");
    }
    return this.val < other.val;
  }

  gt(other: NumberWithUnits): boolean {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot compare order with different units");
    }
    return this.val > other.val;
  }

  lte(other: NumberWithUnits): boolean {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot compare order with different units");
    }
    return this.val <= other.val;
  }

  gte(other: NumberWithUnits): boolean {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot compare order with different units");
    }
    return this.val >= other.val;
  }

  mul(other: NumberWithUnits): NumberWithUnits {
    return new NumberWithUnits(this.val * other.val, this.length+other.length, this.angle+other.angle);
  }

  div(other: NumberWithUnits): NumberWithUnits {
    return new NumberWithUnits(this.val / other.val, this.length-other.length, this.angle-other.angle);
  }

  add(other: NumberWithUnits): NumberWithUnits {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot add with different units");
    }
    return new NumberWithUnits(this.val + other.val, this.length, this.angle);
  }

  sub(other: NumberWithUnits): NumberWithUnits {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Cannot subtract with different units");
    }
    return new NumberWithUnits(this.val - other.val, this.length, this.angle);
  }

  neg(): NumberWithUnits {
    return new NumberWithUnits(-this.val, this.length, this.angle);
  }

  as(other: NumberWithUnits): number {
    if (!this.hasSameUnitsAs(other)) {
      throw new Error("Incompatible units");
    }
    return this.div(other).val;
  } 
  toString(): string {
    return `${this.val} m^${this.length} rad^${this.angle}`;
  }
}

export function inUnits(val: number, units: NumberWithUnits): NumberWithUnits {
  return new NumberWithUnits(val*units.val, units.length, units.angle);
}

export const meter = new NumberWithUnits(1, 1, 0);
export const centimeter = new NumberWithUnits(0.01, 1, 0);
export const millimeter = new NumberWithUnits(0.001, 1, 0);
export const inch = new NumberWithUnits(0.0254, 1, 0);
export const foot = new NumberWithUnits(0.3048, 1, 0);
export const rad = new NumberWithUnits(1, 0, 1);
export const degree = new NumberWithUnits(0.0174533, 0, 1);

const UNIT_MAP: Record<string, NumberWithUnits> = {
  "m": meter,
  "meter": meter,
  "cm": centimeter,
  "mm": millimeter,
  "in": inch,
  "inch": inch,
  "ft": foot,
  "foot": foot,
  "deg": degree,
  "degree": degree,
  "rad": rad
};

/**
 * Returns >0 if op1 has higher precedence than op2, <0 if vice-versa, and 0 if equal
 * @param op1 
 * @param op2 
 */
function precedenceCompare(op1: string, op2: string): number {
  let precLevel1 = getPrecedence(op1);
  let precLevel2 = getPrecedence(op2);
  return precLevel1 - precLevel2;
}

function getPrecedence(op: string): number {
  switch(op) {
    case "-":
    case "+":
      return 1;
    case "*":
    case "/":
      return 2;
    case "@":
      return 10;
  }
  return 0;
}

function isOp(token: string): boolean {
  return token === "+" || token === "-" || token === "*" || token === "/" || token === "(" || token === ")" || token === "@";
}

export function evalMath(input: string): NumberWithUnits {
  let opstack: string[] = [];
  let outqueue: string[] = [];

  // Treat each unit as a multiplication of that unit with a unitless number
  let regex = "\\b(";
  for (let key in UNIT_MAP) {
    regex += `${key}|`;
  }
  regex = regex.slice(0, regex.length-1); // remove last pipe
  regex += ")\\b";
  let regex_ = new RegExp(regex, 'g');

  // Initial replacements- pi, ', and "
  input = input.toLowerCase().replaceAll("pi", `${Math.PI}`).replaceAll("\"", "in").replaceAll("\'", "ft");
  // We use @ to stand in for * with a very high precedence
  input = input.toLowerCase().replaceAll(/(\d+)/g, " $1 ").replaceAll(regex_, "@$1").replaceAll(/\s+/g, '');

  let buffer = "";
  while (input.length > 0) {
    // Read until we reach an operator
    let c = input.charAt(0);
    input = input.slice(1);
    if (isOp(c)) {
      if (buffer.length > 0) {
        outqueue.push(buffer);
      }
      buffer = "";
      if (c === "(") {
        opstack.push(c);
      }
      else if (c === ")") {
        let foundparen = false;
        while (opstack.length > 0) {
          if (opstack[opstack.length-1] !== "(") {
            outqueue.push(opstack.pop()!);
          }
          else {
            foundparen = true;
            break;
          }
        }
        if (!foundparen) {
          throw new Error("Mismatched Parens");
        }
        opstack.pop(); // Gets rid of left paren on top
      }
      else { // Token is an operator
        while (opstack.length > 0 && (precedenceCompare(opstack[opstack.length-1], c) >= 0 /* All operators left associative */) && opstack[opstack.length-1] !== "(") {
          outqueue.push(opstack.pop()!);
        }
        opstack.push(c);
      }
    }
    else {
      buffer += c;
    }
  }
  if (buffer.length > 0) {
    outqueue.push(buffer);
  }
  while (opstack.length > 0) {
    let top = opstack.pop()!;
    if (top === "(" || top === ")") {
      throw new Error("Mismatched Parens");
    }
    outqueue.push(top);
  }

  // outqueue becomes an RPN expression; evaluate it.
  let rpnstack: NumberWithUnits[] = [];
  for (let i = 0; i < outqueue.length; ++i) {
    let c = outqueue[i];
    if (isOp(c)) {
      let op2: NumberWithUnits = rpnstack.pop()!;
      let op1: NumberWithUnits = rpnstack.pop()!;
      let result: NumberWithUnits = op1; // shouldn't ever pass through
      switch(c) {
        case "+":
          result = op1.add(op2);
          break;
        case "-":
          result = op1.sub(op2);
          break;
        case "@":
        case "*":
          result = op1.mul(op2);
          break;
        case "/":
          result = op1.div(op2);
          break;
      }
      rpnstack.push(result);
    }
    else { // This is a number
      c = c.trim();
      if (c in UNIT_MAP) { // Units are treated as their own "number", so this should always be either a unit alone or a number alone
        rpnstack.push(UNIT_MAP[c]);
      }
      else {
        rpnstack.push(new NumberWithUnits(+c, 0, 0)); // Unitless
      }
    }
  }
  return rpnstack.pop()!;
}