# Google Workspace CLI: mailbox access for three accounts

**Date:** 2026-08-03
**Purpose:** give the `gws` CLI working Gmail access to all three mail accounts, so outreach tooling can read and send from them.
**Companion doc:** `consulting/email-workspace-setup.md` (the Workspace side: domains, MX, DKIM).

## Where things stand

| Account | Profile | Status |
|---|---|---|
| cbolden15@gmail.com | `cbolden15` | Working, `gmail.modify` |
| admin@voratechnology.com | `vora` | Consent works, API calls 403 |
| caleb@calebbolden.com | none | Needs its own OAuth client |

Two console tasks remain, below. Everything after them is CLI work that can be handed back.

## How gws stores accounts

`gws` reads exactly one credential pair: `~/.config/gws/client_secret.json` and `~/.config/gws/credentials.enc`. Profiles are the same pair with a `-<name>` suffix. The `gws-use` shell function in `~/.zshrc` swaps them:

```
gws-use                 # list profiles, show the active one
gws-use <profile>       # switch
gws-use --save <name>   # file the current login as a profile
gws-use -f <profile>    # switch, discarding an unsaved login
```

`gws auth login` always writes to the unsuffixed pair, so the sequence for any account is: activate the profile, log in, then save. `gws-use` refuses to switch over a login that has not been filed, which is the guard against silently overwriting a token.

## Task 1: unblock admin@voratechnology.com

The account consents correctly. A valid `gmail.modify` token for `admin@voratechnology.com` was obtained through the project's own OAuth client. Every Gmail API call then fails:

```
403  Caller does not have required permission to use project vora-platform.
     Grant the caller the roles/serviceusage.serviceUsageConsumer role, or a
     custom role with the serviceusage.services.use permission.
```

Already ruled out, so do not spend time re-checking:

- `gmail.googleapis.com` is enabled on `vora-platform`
- `admin@voratechnology.com` holds `roles/owner`, and is the sole owner
- The OAuth client `105549081218-2nng7b62ub9s37vcao366euti5rpds22` lives in `vora-platform` (project number `105549081218`, matches)
- The project is ACTIVE, parented to org `472466497289`
- No org policies were returned for the project
- The same `gws` binary, same machine, same minute, successfully calls Gmail for `cbolden15@gmail.com` through a different OAuth client. The failure follows the project, not the account or the tool.

**The leading hypothesis is Workspace API access control, not GCP IAM.** It is a hypothesis. Work the list in order and stop when calls succeed.

### 1a. Workspace app access control

`admin.google.com` as admin@voratechnology.com → Security → Access and data control → API controls.

- Under "App access control", check whether third-party app access is restricted.
- If it is, add the OAuth client `105549081218-2nng7b62ub9s37vcao366euti5rpds22` as a trusted app, scoped to Gmail.
- "Trust internal, domain-owned apps" also governs this. If the app is domain-owned and that setting is off, turning it on is the smaller change.

Changes here can take several minutes to propagate.

### 1b. OAuth client user type

`console.cloud.google.com` → project `vora-platform` → APIs & Services → OAuth consent screen.

Confirm User Type is **Internal**. Consent succeeded for a domain user, which suggests it already is, but confirm rather than assume. If it reads External, switch it to Internal.

### 1c. Fallback: a fresh client

If 1a and 1b do not clear it, stop debugging `vora-platform` and build a purpose-made client. Follow Task 2 exactly, signed in as admin@voratechnology.com, creating the project in the voratechnology.com org. This is guaranteed to work and takes about ten minutes. It also gets Gmail access off the platform project, which is arguably where it should have been.

## Task 2: create an OAuth client for caleb@calebbolden.com

This account has no client at all. It needs an **Internal** app in a project the calebbolden.com Workspace owns. Internal apps skip Google's verification review entirely, which is the wall that blocks every other route here.

Sign in to `console.cloud.google.com` as **caleb@calebbolden.com**, not cbolden15@gmail.com.

1. **Create a project.** Name it for what it does, for example `caleb-mail-cli`. Confirm the org selector shows calebbolden.com and not "No organization". If it shows no organization, the project will not be able to host an Internal app, and nothing after this step will work.
2. **Enable the Gmail API.** APIs & Services → Library → Gmail API → Enable.
3. **Configure the consent screen.** APIs & Services → OAuth consent screen → User Type: **Internal**. App name something recognizable such as `Caleb Mail CLI`. Support email and developer contact both `caleb@calebbolden.com`. Internal apps need no scope justification and no verification.
4. **Create the credential.** Credentials → Create credentials → OAuth client ID → Application type: **Desktop app**. Name it `gws-cli`.
5. **Download the JSON.** Save it to `~/.config/gws/client_secret-caleb.json`.

Do not run `gws auth login` yet. The download alone is enough to hand back.

## After the console work

These are CLI steps. Hand back at this point and they can be run for you.

For caleb@:

```
gws-use --save cbolden15          # file whatever is currently active first
cp -p ~/.config/gws/client_secret-caleb.json ~/.config/gws/client_secret.json
gws auth login --services gmail   # consent as caleb@calebbolden.com
gws-use --save caleb
```

For admin@, once Task 1 clears:

```
gws-use vora
gws auth login --services gmail   # consent as admin@voratechnology.com
gws-use --save vora
```

Verify each with:

```
gws gmail users getProfile --params '{"userId":"me"}'
```

A working profile returns `emailAddress` and `messagesTotal`. A broken one returns a 403 with a `message` field naming the cause.

## Notes worth carrying forward

- **The account chooser cannot be trusted.** Three logins in a row silently used the browser's already-signed-in Google session instead of the intended account. Append `&login_hint=<address>` to the consent URL, or use a private window. Always confirm which account actually landed before filing a token.
- **`gws auth status` misreports scopes.** It listed no Gmail scope for a token that demonstrably called the Gmail API. Trust `getProfile` over `auth status`.
- **`GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` expects a plaintext credentials file.** It bypasses the keyring, so pointing it at an `.enc` file fails with a UTF-8 error. It is not a profile switch, and using it would mean a refresh token sitting unencrypted on disk.
- **The `personal` profile is a duplicate.** It carries the same retired `life-agent-automation` client as `cbolden15`, with an older token. Delete it once the three real accounts are filed.
- **`cbolden15` still depends on the retired `life-agent-automation` project.** It works today. If that project is ever deleted, the profile dies. Worth migrating eventually, not urgent.
- The `vora-platform` OAuth client is backed up at `~/.config/gws/client_secret-vora.json.bak-voraplatform`.
