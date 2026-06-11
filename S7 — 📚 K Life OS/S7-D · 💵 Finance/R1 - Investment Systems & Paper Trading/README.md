# R1 - Investment Systems & Paper Trading

`S7-D-R1` is the finance-facing research home for the investment monitoring environment, VM paper bot, browser simulation layer, and dashboard state model.

## Status

Active private runtime with public research scaffold.

The live VM, Firebase credentials, UID files, and service-account material stay outside GitHub. This folder documents the safe public structure, metrics, and synchronization logic only.

## Research question

Can a small paper-trading system make investment behavior measurable enough to separate strategy performance, fees, slippage, funding, drawdown, and operator decisions?

## System layers

| Layer | Current role | Public repo treatment |
|---|---|---|
| VM paper bot | Runs the `futures_bb` strategy loop and writes state | Documented, not mirrored with secrets |
| Firebase RTDB | Receives normalized bot state | Schema documented only |
| Browser SIM | Demo and sandbox state for UI testing | Treated as a separate simulated environment |
| Dashboard | Displays equity, positions, trades, drawdown, fees, and funding | Public interface concept |
| Research notes | Interpret behavior and risk signals | Safe to keep in GitHub |

## Active metrics

- `equity`
- `cash`
- `positions`
- `trades_count`
- `realized_pnl`
- `max_drawdown`
- `funding_paid`
- `fees_paid`
- `equity_history`
- latest push timestamp

## Current sync decision

`fees_paid` belongs in the VM state and Firebase payload.

Reason:

- entry fees and slippage already reduce `cash`
- exit fees and slippage already reduce realized net PnL
- without `fees_paid`, equity drops look unexplained
- one numeric field keeps VM and browser SIM comparable
- dashboard already has a row for Fees Paid

## Current implementation note

The live VM logic should keep the same accounting model as the browser SIM:

```text
entry cost = fee + slippage
exit cost = fee + slippage
net exit PnL = gross PnL - fee - slippage
fees_paid = cumulative fee + slippage
```

## What does not belong in public GitHub

- Firebase service account JSON
- private UID files
- Telegram tokens or chat IDs
- exchange keys
- live VM SSH material
- full runtime state if it contains account identifiers

## Public-safe next outputs

- `docs/state-schema.md`
- `docs/vm-sync-notes.md`
- `docs/risk-and-cost-accounting.md`
- sanitized dashboard screenshots
- periodic research notes after enough paper trades exist

## Disclaimer

This is an experimental paper-trading and finance-observation system. It is not financial advice and should not be interpreted as a recommendation to trade crypto, futures, leverage, or any financial instrument.
