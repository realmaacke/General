"use strict";
const BASEURL = "https://api.petterssonhome.se";

export interface FolderSizes {
  media: string;
  movies: string;
  series: string;
}

export interface DiskInfo {
  filesystem: string;
  total: string;
  used: string;
  free: string;
  usage_percent: string;
  mount: string;
  warning: boolean;
}

export interface DataGathering {
  folders: FolderSizes;
  disk: DiskInfo;
}

export async function gatherData(): Promise<DataGathering> {
    const res = await fetch(`${BASEURL}/data/usage`);

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    const data: DataGathering = await res.json();

    return data;
}