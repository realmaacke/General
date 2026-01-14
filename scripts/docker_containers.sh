#!/usr/bin/bash

set -euo pipefail

COMPOSE_PATH="../docker-compose.yml"
CONTAINERS=()

# Grabs info about containers using the compose ps command.
while read -r cid; do
    name=$(docker inspect -f '{{.Name}}' "$cid" | sed 's#^/##')
    state=$(docker inspect -f '{{.State.Status}}' "$cid")
    started=$(docker inspect -f '{{.State.StartedAt}}' "$cid")
    ports=$(docker inspect -f '{{range $p, $v := .NetworkSettings.Ports}}{{$p}} {{end}}' "$cid")

    safe_name=${name//[^a-zA-Z0-9_]/_}

    now=$(date +%s)
    start_ts=$(date -d "$started" +%s)
    uptime=$((now - start_ts))

    CONTAINERS+=("$safe_name")

    declare -gA "container_$safe_name"
    eval "container_$safe_name[name]=\"$name\""
    eval "container_$safe_name[state]=\"$state\""
    eval "container_$safe_name[uptime]=\"$uptime\""
    eval "container_$safe_name[ports]=\"$ports\""
done < <(docker compose -f "$COMPOSE_PATH" ps -q)


# Wraps it inside a variable
output=$(
  # everything that currently prints:
  for name in "${CONTAINERS[@]}"; do
      eval "state=\${container_$name[state]}"
      eval "uptime=\${container_$name[uptime]}"
      eval "ports=\${container_$name[ports]}"
      echo "$name | $state | ${uptime}s | $ports"
  done
)

#Formats it to be used as JSON data inside dashboard.
printf '%s\n' "$output" | jq -Rn '
  [ inputs
    | split(" | ")
    | {
        name: .[0],
        state: .[1],
        uptime: (.[2] | sub("s$"; "") | tonumber),
        ports: (.[3] | split(" ") | map(select(length > 0)))
      }
  ]
'