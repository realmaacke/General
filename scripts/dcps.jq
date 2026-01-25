def green(s): "\u001b[32m" + s + "\u001b[0m";
def yellow(s): "\u001b[33m" + s + "\u001b[0m";
def red(s): "\u001b[31m" + s + "\u001b[0m";
def blue(s): "\u001b[34m" + s + "\u001b[0m";

def color_state(s):
  if s == "running" then green(s)
  elif s == "restarting" then yellow(s)
  else red(s)
  end;

def color_status(s):
  if s == "Up" then green(s)
  elif s == "Restarting" then yellow(s)
  else red(s)
  end;

def color_ports(p):
  if p == "-" then red(p)
  elif (p | split(",") | any(split(":") | .[0] != .[1])) then blue(p)
  else p
  end;

["SERVICE","STATE","STATUS","PORTS","PROTO"],
(.[] | [
  .Service,
  color_state(.State),
  color_status((.Status | split(" ")[0])),
  (
    (.Publishers // [])
    | map(select(.PublishedPort != 0))
    | map("\(.PublishedPort):\(.TargetPort)")
    | unique
    | if length == 0 then "-" else join(",") end
    | color_ports(.)
  ),
  (
    (.Publishers // [])
    | map(.Protocol)
    | unique
    | if length == 0 then "-" else join(",") end
  )
])
| @tsv

