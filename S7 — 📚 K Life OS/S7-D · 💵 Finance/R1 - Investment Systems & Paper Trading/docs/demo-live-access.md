# Demo & live paper — public access

**Dashboard:** [k-investments-hub-crypto-bot.web.app](https://k-investments-hub-crypto-bot.web.app)

Experimental **paper-trading** research environment (Binance futures klines, no live orders). Not financial advice.

---

## What you can open today

| Mode | Who | What you see |
|------|-----|--------------|
| **Browser SIM** (sandbox) | Any Google account, within slot limit | Your own virtual bot: Run / Pause / Reset, $100–1000 paper balance, same BB+regime strategy family as the research VM |
| **Live paper авторки** (read-only) | Accounts with an access code | Mirror of the owner's 24/7 VM paper bot: equity, positions, trades, fees, funding — no controls |
| **VM owner** | Operator only | Full server bot + push; not a public surface |

Sign in with **Google** on Firebase Hosting (`.web.app`). Vercel mirrors are not supported for auth.

---

## Browser SIM — 20 account limit

Sandbox uses a shared slot counter in Firebase (`demo_slots`).

- **First 20 distinct Google accounts** that start SIM get a permanent slot for this research phase.
- If Start fails with *«Demo повний (ліміт 20 акаунтів)»* — all slots are taken. You are **not** in the first 20; try again only if we open more slots later.
- Already registered accounts keep their slot (re-login works).
- Owner / operator UID is exempt from the slot cap.

SIM is **separate** from live paper: your sandbox state does not affect the author's VM run.

**SIM behaviour (short):**

- Strategy: BB crossover + regime + RSI filters, 15m candles, up to 3 positions.
- **Run** — entries and exits. **Pause** — only manage open positions.
- Tab open → fast browser step (~1 s). Tab closed → cloud watch (~1 min) continues exits; entries only if you left **Run** (not Pause).

Details are also in the dashboard under *Умови SIM*.

---

## Live paper авторки — code required

Read-only stream from `public_live_paper` (VM mirror).

1. Sign in with Google.
2. Open tab **Live paper авторки**.
3. Enter the **access code** (distributed separately — course / subscription / invite).
4. View equity curve, open positions, closed trades, drawdown, fees, funding.

No Start/Pause/Reset on this tab. It reflects what the VM paper bot does 24/7.

Codes are not stored in this public repo. See [state-schema.md](./state-schema.md) for RTDB paths (`viewers/{uid}`, `public_live_paper`).

---

## What we measure

Aligned with [risk-and-cost-accounting.md](./risk-and-cost-accounting.md):

- `equity`, `cash`, `positions`, `trades_count`, `realized_pnl`
- `max_drawdown`, `funding_paid`, `fees_paid`, `equity_history`
- Trade rows: opened / closed time, hold duration, entry / exit, PnL, exit type

WFO backtest figures (15–23%/mo on selected alts) are **research optimism** — paper forward test is the honest check.

---

## Safety & scope

- Paper only. No exchange keys in the browser.
- No promise of profitability; past paper ≠ future results.
- Infrastructure secrets (VM, service accounts, codes) stay **out of GitHub** — see parent [README](../README.md).

---

## Related docs

- [state-schema.md](./state-schema.md) — RTDB shape
- [vm-sync-notes.md](./vm-sync-notes.md) — VM → Firebase cadence
- [risk-and-cost-accounting.md](./risk-and-cost-accounting.md) — fees & slippage model

**Lane:** [S7-D · Finance](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE/tree/main/S7%20%E2%80%94%20%F0%9F%93%9A%20K%20Life%20OS/S7-D%20%C2%B7%20%F0%9F%92%B5%20Finance) · K Life OS
