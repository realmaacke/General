"use strict";

export function subToDomain(subdomain: string, domain = "petterssonhome.se"): string {
    return "https://" + subdomain + "." + domain;
}

export function parseSizeGB(value: string): number {
  // "323G", "1.2T", "512M"
  const match = value.match(/^([\d.]+)([TGM])$/i);
  if (!match) return 0;

  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  switch (unit) {
    case "T":
      return num * 1024;
    case "G":
      return num;
    case "M":
      return num / 1024;
    default:
      return 0;
  }
}

export function parsePercent(value: string): number {
  return Number(value.replace("%", "")) || 0;
}