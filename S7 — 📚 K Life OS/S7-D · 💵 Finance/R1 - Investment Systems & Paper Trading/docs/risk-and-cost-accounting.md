# Risk And Cost Accounting

## Purpose

This note defines how `S7-D-R1` should interpret costs and risk in a paper-trading environment.

The goal is not to make the bot look better. The goal is to make every visible change in equity explainable.

## Cost fields

| Field | Meaning |
|---|---|
| `fees_paid` | Cumulative modeled exchange fee plus slippage |
| `funding_paid` | Cumulative funding cost |
| `realized_pnl` | Net closed-trade PnL after exit costs |
| `cash` | Free cash after margin, fees, slippage, realized PnL, and funding |
| `equity` | Free cash plus open-position value |

## Entry accounting

On entry:

```text
cash = cash - margin - fee - slippage
fees_paid = fees_paid + fee + slippage
```

## Exit accounting

On exit:

```text
net = gross_pnl - fee - slippage
cash = cash + margin + net
realized_pnl = realized_pnl + net
fees_paid = fees_paid + fee + slippage
```

## Interpretation rule

If equity drops while no position has moved meaningfully against the bot, first check:

- entry fee
- entry slippage
- funding
- exit fee
- exit slippage

This prevents cost drag from being misread as strategy loss.

## Dashboard rule

The dashboard should show `fees_paid` and `funding_paid` near PnL and drawdown. These values explain why a paper account can be below the starting balance even before a clear losing trade appears.

## Research caveat

Modeled fees and slippage are assumptions. They make a simulation more honest, but they are not proof of real exchange execution quality.
