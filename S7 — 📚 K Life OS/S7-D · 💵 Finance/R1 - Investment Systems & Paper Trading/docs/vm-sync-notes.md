# VM Sync Notes

## Current runtime stance

The VM remains the live private runtime. GitHub keeps only the public research scaffold and sanitized architecture notes.

## Sync flow

```text
VM paper bot
  -> local state JSON
  -> push_to_firebase.py
  -> Firebase RTDB
  -> dashboard
  -> periodic research interpretation in S7-D
```

## Fees and funding

The VM and browser SIM should keep the same fields:

- `fees_paid`
- `funding_paid`
- `equity_history`
- `positions`
- `trades`

This is not excessive state. It is a small telemetry surface that makes the system auditable.

## Telegram

Telegram remains out of scope for the current sync pass.

Reason:

- the dashboard/Firebase loop is enough for system observability
- Telegram introduces token handling and notification policy
- it can be added later as an optional alert layer

## Public safety

Do not commit:

- service-account files
- UID files
- SSH material
- tokens
- live state snapshots with identifiers
- exchange credentials
