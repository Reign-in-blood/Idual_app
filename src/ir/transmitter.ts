import { Capacitor, registerPlugin } from '@capacitor/core';
import { findCommand, type CommandId } from './codes';

interface ConsumerIrPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  transmit(options: { code: string; carrierFrequency: number }): Promise<void>;
}
const nativeIr = registerPlugin<ConsumerIrPlugin>('ConsumerIr');

export async function isIrAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try { return (await nativeIr.isAvailable()).available; } catch { return false; }
}

export async function sendCommand(id: CommandId): Promise<void> {
  if (!Capacitor.isNativePlatform()) throw new Error('Émission IR disponible uniquement dans l’application Android.');
  const command = findCommand(id);
  await nativeIr.transmit({ code: command.code, carrierFrequency: 38000 });
}
