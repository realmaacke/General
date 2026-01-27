"use strict";

export default function subToDomain(subdomain: string, domain = "petterssonhome.se"): string {
    return "https://" + subdomain + "." + domain;
}