import json
import re
from pathlib import Path

INPUT_LOG = Path("/home/devuser/dev/general/logs/compose.log")
OUTPUT_LOG = Path("/home/devuser/dev/general/logs/parsed.log")

def parse_line(line: str):
    try:
        service, rest = line.split("|", 1)
        rest = rest.strip()

        timestamp, message = rest.split(" ", 1)

        return {
            "service": service.strip(),
            "timestamp": timestamp,
            "message": message,
        }
    except ValueError:
         return None

def main():
    if not INPUT_LOG.exists():
        print(f"No log file exists at: {INPUT_LOG}")
        return
    
    if INPUT_LOG.stat().st_size == 0:
        print(f"No logs in file: {INPUT_LOG}")
        return

    with (
        INPUT_LOG.open("r", encoding="utf-8") as infile,
        OUTPUT_LOG.open("a", encoding="utf-8") as out,
    ):
            for line in infile:
                parsed = parse_line(line)
                if parsed:
                     out.write(json.dumps(parsed, ensure_ascii=False) + "\n")
    

    print("Log cleared")
    INPUT_LOG.unlink(missing_ok=True)

if __name__ == "__main__":
    main()