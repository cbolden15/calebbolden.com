# Client credential policy

One page. This governs how access to client systems is requested, stored, and revoked for any engagement that touches client tools (CRM, email, automation platforms, scheduling software, anything else).

## The policy

1. **Credentials are never accepted over email, chat, or a spreadsheet.** Not a password in a text message, not a shared doc, not a Slack DM. If a client tries to send credentials that way, redirect them to one of the two methods below before touching anything.
2. **Preferred method: the client provisions a separate, named account scoped to only what the engagement needs.** This keeps access auditable and cleanly revocable, and it's the practice a client should expect from anyone reputable handling their systems.
3. **Fallback method: a dedicated Vaultwarden collection, shared for the engagement.** Used when the client's platform doesn't support scoped accounts. Access to the collection is limited to what's needed, and it's closed out at offboarding along with everything else.
4. **MFA is required** on any account or vault used for this engagement, no exceptions.
5. **Access is revoked at offboarding**, tracked as an explicit step in `offboarding-checklist.md`. Scoped accounts get deactivated, vault shares get closed, and anything that had to be shared directly (rare, and only if neither method above was possible) gets rotated.

## Why this matters

An AI consulting engagement plausibly touches a client's CRM, email, or automation tools directly. How access is handled is a trust signal before it's a security requirement, and it's worth having in writing before the first engagement that needs it, not improvised in the moment.

## Kickoff email paragraph

Use this in the kickoff email or during the access-planning part of the kickoff call:

> For any system access this engagement needs, I don't accept passwords over email or chat. The easiest path is a scoped account you create for me, limited to what's actually needed, with MFA turned on. If that's not possible for a given tool, we'll use a dedicated shared vault instead. Either way, access gets fully revoked the moment the engagement wraps up.
