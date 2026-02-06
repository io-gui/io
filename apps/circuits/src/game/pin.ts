/**
 * Pin — pure data class (no rendering).
 * Rendering is handled centrally by scene.render().
 */

export interface PinData {
  x: number;
  y: number;
  c: string;
  ID: number;
  readonly?: boolean;
}

export class Pin {
  x: number;
  y: number;
  c: string;
  ID: number;
  c2: string;
  isReadonly: boolean;

  constructor(x: number, y: number, c: string, ID: number, c2?: string) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.ID = ID;
    this.c2 = c2 ?? c;
    this.isReadonly = false;
  }
}

/** Deserialise a pins map from saved JSON data. */
export function pinsFromString(data: Record<string, PinData>): Record<number, Pin> {
  const pins: Record<number, Pin> = {};
  for (const i in data) {
    pins[i as unknown as number] = new Pin(data[i].x, data[i].y, data[i].c, data[i].ID);
    pins[i as unknown as number].isReadonly = data[i].readonly ?? false;
  }
  return pins;
}
