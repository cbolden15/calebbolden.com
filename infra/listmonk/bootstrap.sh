#!/usr/bin/env bash
set -euo pipefail
source ~/.dev-secrets.env
AUTH="$LISTMONK_API_USER:$LISTMONK_API_TOKEN"
BASE="https://lists.calebbolden.com/api"

create_list() { # name, tag
  existing=$(curl -su "$AUTH" "$BASE/lists?per_page=100" | python3 -c "import sys,json; print(any(l['name']=='$1' for l in json.load(sys.stdin)['data']['results']))")
  if [ "$existing" = "False" ]; then
    curl -su "$AUTH" -X POST "$BASE/lists" -H 'Content-Type: application/json' \
      -d "{\"name\":\"$1\",\"type\":\"public\",\"optin\":\"double\",\"tags\":[\"$2\"]}"
  fi
}
create_list "The Missed Call" owners
create_list "The Workflow Brief" operators
curl -su "$AUTH" "$BASE/lists?per_page=100" | python3 -c "import sys,json; [print(l['id'], l['name'], l['optin']) for l in json.load(sys.stdin)['data']['results']]"
