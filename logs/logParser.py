import json
import re
from pathlib import Path

INPUT_LOG = Path("/home/devuser/dev/general/logs/compose.log")
OUTPUT_LOG = Path("/home/devuser/dev/general/logs/parsed.log")

LOG_PATTERN = re.compile(
    r'^(?P<service>[^|]+?)\s*\|\s*(?P<timestamp>\S+)\s*(?P<message>.*)$'
)

def parse_line(line: str):
    match = LOG_PATTERN.match(line.rstrip("\n"))
    if not match:
        return None

    return {
        "service": match.group("service").strip(),
        "timestamp": match.group("timestamp"),
        "message": match.group("message"),
    }

def main():
    if not INPUT_LOG.exists():
        print(f"No log file exists at: {INPUT_LOG}")
        return

    content = INPUT_LOG.read_text(encoding="utf-8")
    if not content.strip():
        print(f"No logs exists in file: {INPUT_LOG}")
        return

    with OUTPUT_LOG.open("a", encoding="utf-8") as out:
        for line in content.splitlines():
            parsed = parse_line(line)
            if parsed:
                out.write(json.dumps(parsed, ensure_ascii=False) + "\n")

    # Clear the original log file after successful processing
    INPUT_LOG.write_text("", encoding="utf-8")

if __name__ == "__main__":
    main()