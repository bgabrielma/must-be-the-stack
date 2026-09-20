#!/usr/bin/env bash
# Starts packages/api (Rails) and apps/web (Vite) in the background, once per
# container lifetime. Wired to postStartCommand and postAttachCommand in
# devcontainer.json; the pidfile check makes it safe to run from both.
#
# Each service is launched via `setsid` (re-executing this script with
# run-api / run-web) so it leaves the lifecycle command's process group and
# survives that command exiting.
set -euo pipefail

WORKSPACE="/workspace"
RUN_DIR="/tmp/dev-services"
SELF="$(readlink -f "${BASH_SOURCE[0]}")"
mkdir -p "$RUN_DIR"

# A pid that is a zombie counts as not running: `kill -0` succeeds on one, and
# the container's init never reaps orphans, so a killed service would otherwise
# look alive forever and never be restarted.
is_running() {
  local pidfile="$1" pid state
  [ -f "$pidfile" ] || return 1
  pid="$(cat "$pidfile")"
  state="$(ps -o stat= -p "$pid" 2>/dev/null)" || return 1
  case "$state" in
    "" | Z*) return 1 ;;
  esac
}

port_in_use() {
  local port="$1"
  (exec 3<>"/dev/tcp/127.0.0.1/${port}") 2>/dev/null && exec 3>&- && return 0
  return 1
}

wait_for_postgres() {
  local host="${POSTGRES_HOST:-postgres}"
  local port="${POSTGRES_PORT:-5432}"
  for _ in $(seq 1 30); do
    (exec 3<>"/dev/tcp/${host}/${port}") 2>/dev/null && exec 3>&- && return 0
    sleep 1
  done
  echo "start-services: postgres not reachable at ${host}:${port} after 30s, starting api anyway" >&2
}

run_api() {
  cd "$WORKSPACE/packages/api"
  wait_for_postgres
  bin/setup --skip-server
  bin/rails curriculum:seed
  exec bin/dev
}

run_web() {
  cd "$WORKSPACE/apps/web"
  [ -d node_modules ] || pnpm install
  exec pnpm dev
}

start_api() {
  local pidfile="$RUN_DIR/api.pid"
  local logfile="$RUN_DIR/api.log"
  if is_running "$pidfile" || port_in_use 3000; then
    echo "start-services: api already running, skipping"
    return 0
  fi

  setsid nohup "$SELF" run-api >"$logfile" 2>&1 </dev/null &
  echo $! >"$pidfile"
  echo "start-services: api starting (pid $(cat "$pidfile"), log $logfile)"
}

start_web() {
  local pidfile="$RUN_DIR/web.pid"
  local logfile="$RUN_DIR/web.log"
  if is_running "$pidfile" || port_in_use 5173; then
    echo "start-services: web already running, skipping"
    return 0
  fi

  setsid nohup "$SELF" run-web >"$logfile" 2>&1 </dev/null &
  echo $! >"$pidfile"
  echo "start-services: web starting (pid $(cat "$pidfile"), log $logfile)"
}

case "${1:-}" in
  run-api) run_api ;;
  run-web) run_web ;;
  *)
    start_api
    start_web
    ;;
esac
