// Centralized event for when a chatter sends a message
import { Chatter } from "@/engine/state/chatters";

export type ChatterMessageEvent = {
  username: string;
  message: string;
  chatter: Chatter;
};

const listeners: Array<(event: ChatterMessageEvent) => void> = [];

export function emitChatterMessage(event: ChatterMessageEvent) {
  listeners.forEach((fn) => fn(event));
}

export function onChatterMessage(fn: (event: ChatterMessageEvent) => void) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}
