import type { ComponentType } from "react";
import {
  Award,
  Flag,
  Handshake,
  Layers,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const map: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  flag: Flag,
  layers: Layers,
  handshake: Handshake,
  "trending-up": TrendingUp,
  shield: Shield,
  award: Award,
  users: Users,
  sparkles: Sparkles,
};

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && map[name]) || Layers;
  return <Cmp size={22} className={className} />;
}
