#!/usr/bin/env bash
set -e
BASE=${1:-http://localhost:3000}
echo "valid owners:";   curl -s -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"caleb+probe-owners@calebbolden.com","list":"owners"}'; echo
echo "valid operators:"; curl -s -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"caleb+probe-operators@calebbolden.com","list":"operators"}'; echo
echo "bad list:";       curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"a@b.com","list":"nope"}'
echo "bad email:";      curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"not-an-email","list":"owners"}'
