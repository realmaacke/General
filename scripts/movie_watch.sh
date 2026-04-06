#!/usr/bin/bash


Movies="/home/$USER/media/movies"

create_missing_nfo() {
    while true; do
        # Find direct movie directories
        mapfile -t movies < <(find "$Movies" -mindepth 1 -maxdepth 1 -type d)

        for movie in "${movies[@]}"; do
            # Check if a .nfo exists in the folder (top-level only)
            if ! find "$movie" -maxdepth 1 -type f -name "*.nfo" -quit | grep -q .; then
                folder_name="$(basename "$movie")"
                nfo_file="$movie/$folder_name.nfo"

                echo "Creating: $nfo_file"

                cat > "$nfo_file" <<EOF
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<movie>
    <title>$folder_name</title>
    <originaltitle>$folder_name</originaltitle>
    <userrating>0</userrating>
    <plot></plot>
    <mpaa></mpaa>
    <uniqueid type="" default="true"></uniqueid>
    <genre></genre>
    <tag></tag>
    <country></country>
    <set>
        <name></name>
        <overview></overview>
    </set>
    <credits></credits>
    <director></director>
    <premiered></premiered>
    <studio></studio>
    <actor>
        <name></name>
        <role></role>
        <order></order>
    </actor>
</movie>
EOF
            fi
        done

        # Sleep 2 minutes between iterations
        sleep 120
    done
}

# Run the function in background
create_missing_nfo &

# Optional: save PID to stop later
echo $! > /tmp/movie_nfo_watcher.pid
