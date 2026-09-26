// Device tilt for the /world viewers. iOS asks permission, and only from a tap, so tilt is always opt-in behind a
// button; other browsers just start sending events.

type WithPermission = { requestPermission?: () => Promise<'granted' | 'denied'> };

/** Tilt is offered on touch devices that report orientation. */
export function tiltAvailable() {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && window.matchMedia('(pointer: coarse)').matches;
}

/** Call from a tap. Resolves true when orientation events are allowed. */
export async function requestTilt(): Promise<boolean> {
  const D = window.DeviceOrientationEvent as unknown as WithPermission;
  if (typeof D.requestPermission !== 'function') return true;
  try {
    return (await D.requestPermission()) === 'granted';
  } catch {
    return false;
  }
}

/**
 * Where the phone's back camera points, as yaw (degrees, right = positive) and pitch (degrees, up = positive), from a
 * deviceorientation reading and the screen's rotation. Same maths as three.js' DeviceOrientationControls.
 */
export function lookFromOrientation(alpha: number, beta: number, gamma: number, screenAngle: number): [number, number] {
  const r = Math.PI / 180;
  const [x, y, z] = [beta * r, alpha * r, -gamma * r];
  const [c1, c2, c3] = [Math.cos(x / 2), Math.cos(y / 2), Math.cos(z / 2)];
  const [s1, s2, s3] = [Math.sin(x / 2), Math.sin(y / 2), Math.sin(z / 2)];
  // Euler (YXZ) → quaternion
  let q = [s1 * c2 * c3 + c1 * s2 * s3, c1 * s2 * c3 - s1 * c2 * s3, c1 * c2 * s3 - s1 * s2 * c3, c1 * c2 * c3 + s1 * s2 * s3];
  const mul = (a: number[], b: number[]) => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
  q = mul(q, [-Math.SQRT1_2, 0, 0, Math.SQRT1_2]); // camera looks out of the back of the device, not the top
  const o = (-screenAngle * r) / 2;
  q = mul(q, [0, 0, Math.sin(o), Math.cos(o)]); // adjust for screen rotation
  // forward = q · (0, 0, −1) · q⁻¹
  const [qx, qy, qz, qw] = q;
  const fx = -2 * (qx * qz + qw * qy);
  const fy = -2 * (qy * qz - qw * qx);
  const fz = -(1 - 2 * (qx * qx + qy * qy));
  return [Math.atan2(fx, -fz) / r, Math.asin(Math.max(-1, Math.min(1, fy))) / r];
}
