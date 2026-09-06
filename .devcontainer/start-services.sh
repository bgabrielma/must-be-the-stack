#!/usr/bin/env bash
# Starts apps/api (Rails) and apps/web (Vite) in the background, once per
# container lifetime. Wired to postStartCommand and postAttachCommand in
# devcontainer.json; the pidfile check makes it safe to run from both.
set -euo pipefail

WORKSPACE="/workspace"
RUN_DIR="/tmp/dev-services"
mkdir -p "$RUN_DIR"

is_running() {
  local pidfile="$1"
  [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null
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

start_api() {
  local pidfile="$RUN_DIR/api.pid"
  local logfile="$RUN_DIR/api.log"
  if is_running "$pidfile" || port_in_use 3000; then
    echo "start-services: api already running, skipping"
    return 0
  fi

  (
    cd "$WORKSPACE/apps/api"
    wait_for_postgres
    bin/setup --skip-server
    bin/rails curriculum:seed
    exec bin/dev
  ) >"$logfile" 2>&1 &
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

  (
    cd "$WORKSPACE/apps/web"
    [ -d node_modules ] || pnpm install
    exec pnpm dev
  ) >"$logfile" 2>&1 &
  echo $! >"$pidfile"
  echo "start-services: web starting (pid $(cat "$pidfile"), log $logfile)"
}

start_api
start_web
