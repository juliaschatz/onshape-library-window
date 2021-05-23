
/**
 * This class contains information about a magnitude and length and angle exponents.
 * `val` should always be in m^j rad^k
 */
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

/**
 * Convenience function to make a new NumberWithUnits in the given units
 * @param val 
 * @param units 
 * @returns 
 */
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
export const unitless = new NumberWithUnits(1, 0, 0);

/**
 * Maps string units to their variable value
 */
export const UNIT_MAP: Record<string, NumberWithUnits> = {
  "m": meter,
  "meter": meter,
  "cm": centimeter,
  "centimeter": centimeter,
  "mm": millimeter,
  "millimeter": millimeter,
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

/**
 * 
 * @param op The single-character operator token
 * @returns Numerical precedence of this operator
 */
function getPrecedence(op: string): number {
  switch(op) {
    case "-":
    case "+":
      return 1;
    case "*":
    case "/":
      return 2;
    case "_":
      return 6;
    case "@":
      return 2;
  }
  return 0;
}

function isOp(token: string): boolean {
  return token === "+" || token === "-" || token === "*" || token === "/" || token === "(" || token === ")" || token === "@" || token === "_";
}

function isRightAssoc(token: string): boolean {
  return token === "_";
}

export function evalMath(input: string): NumberWithUnits {
  let opstack: string[] = [];
  let outqueue: string[] = [];

  // Treat each unit as a multiplication of that unit with a unitless number

  // Create a regex that matches only units
  let regex = "\\b(";
  for (let key in UNIT_MAP) {
    regex += `${key}|`;
  }
  regex = regex.slice(0, regex.length-1); // remove last pipe
  regex += ")\\b";
  let regex_ = new RegExp(regex, 'g');

  // Initial replacements- pi, ', and "
  input = input.toLowerCase().replaceAll("pi", `${Math.PI}`).replaceAll("\"", "in").replaceAll("'", "ft");
  // We use @ to stand in for * for units so we can change its precedence and behavior separately
  // Also get rid of all whitespace
  input = input.toLowerCase().replaceAll(/(\d+)/g, " $1 ").replaceAll(regex_, "@$1").replaceAll(/\s+/g, '');

  // If there's nothing left, there's no number
  if (input.length === 0) {
    return new NumberWithUnits(0,0,0);
  }

  // Implementation of shunting-yard algorithm with unary - and units
  let buffer = "";
  let i = 0;
  while (i < input.length) {
    // Read until we reach an operator, adding to the number/unit buffer as we go
    let c = input.charAt(i++);
    if (isOp(c)) {
      // Push everything from the buffer into the output queue
      if (buffer.length > 0) {
        outqueue.push(buffer);
      }
      buffer = "";

      // Unary check
      const lastchar = input.charAt(i-2);
      if (isOp(lastchar) && lastchar !== ")") {
        if (c === "-") {
          c = "_";
        }
      }

      if (c === "(") { // lparens immediately get put on the stack
        opstack.push(c);
      }
      else if (c === ")") { // With rparens we pop off the operator stack until we find the its partner
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
        if (!foundparen) { // If there wasn't an lparen there, this is an rparen without a mate
          throw new Error("Mismatched Parens");
        }
        opstack.pop(); // Gets rid of left paren on top
      }
      else { // Token is an operator
        while (opstack.length > 0 
          && (precedenceCompare(opstack[opstack.length-1], c) > 0 || (!isRightAssoc(c) && precedenceCompare(opstack[opstack.length-1], c) === 0)) 
          && opstack[opstack.length-1] !== "(") {
          outqueue.push(opstack.pop()!);
        }
        opstack.push(c);
      }
    }
    else {
      buffer += c;
    }
  }
  // If there's anything in the buffer after iterating, push it onto the queue
  if (buffer.length > 0) {
    outqueue.push(buffer);
  }
  while (opstack.length > 0) { // Pop all remaining operators off the stack
    let top = opstack.pop()!;
    if (top === "(" || top === ")") { // There shouldn't be any more parens on the stack
      throw new Error("Mismatched Parens");
    }
    outqueue.push(top);
  }

  // outqueue becomes an RPN expression; evaluate it.
  let rpnstack: NumberWithUnits[] = [];
  for (let i = 0; i < outqueue.length; ++i) {
    let c = outqueue[i];
    if (isOp(c)) { // If the next part is an operand, pop the previous two (or one) values off the stack and oprerate
      let result: NumberWithUnits;
      if (c === "_") {
        let op1: NumberWithUnits = rpnstack.pop()!;
        result = op1.neg();
      }
      else {
        let op2: NumberWithUnits = rpnstack.pop()!;
        let op1: NumberWithUnits = rpnstack.pop()!;
        
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
      }
      // Push the resultant onto the stack
      rpnstack.push(result!);
    }
    else { // This is a number, gets immediately pushed onto stack
      c = c.trim();
      if (c in UNIT_MAP) { // Units are treated as their own "number", so this should always be either a unit alone or a number alone
        rpnstack.push(UNIT_MAP[c]);
      }
      else {
        rpnstack.push(new NumberWithUnits(+c, 0, 0)); // Unitless
      }
    }
  }
  // Whatever remains in the stack is our result
  return rpnstack.pop()!;
}