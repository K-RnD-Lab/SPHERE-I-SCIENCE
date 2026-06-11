# State Schema

This schema describes the public-safe state model for `S7-D-R1`.

## Bot payload

| Field | Type | Meaning |
|---|---:|---|
| `name` | string | Bot display name |
| `mode` | string | `paper`, `sim`, or another explicit environment label |
| `status` | string | Runtime state such as `running`, `paused`, or `stopped` |
| `start_balance` | number | Initial paper balance |
| `equity` | number | Cash plus open-position value |
| `cash` | number | Current free cash |
| `realized_pnl` | number | Closed-trade net PnL |
| `wins` | integer | Count of winning trades |
| `losses` | integer | Count of losing trades |
| `trades_count` | integer | Total closed trades |
| `max_drawdown` | number | Peak-to-current drawdown percentage |
| `fees_paid` | number | Cumulative fees plus modeled slippage |
| `funding_paid` | number | Cumulative funding cost |
| `positions` | array | Open position snapshots |
| `trades` | array | Recent closed trades |
| `equity_history` | array | Recent equity points |
| `last_update` | string | ISO timestamp of latest push |

## Position payload

| Field | Type | Meaning |
|---|---:|---|
| `symbol` | string | Market symbol |
| `base` | string | Base asset |
| `side` | string | `long` or `short` |
| `entry_price` | number | Entry price |
| `current_price` | number | Latest known price |
| `qty` | number | Position quantity |
| `margin` | number | Margin allocated |
| `leverage` | number | Paper leverage |
| `regime` | string | Strategy regime label |

## Accounting rule

`fees_paid` should increase whenever fee or slippage is charged in the paper model.

This keeps dashboard interpretation honest: if equity falls from cost drag rather than market loss, the UI can show that explicitly.
