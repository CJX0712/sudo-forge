# ✦ SudoForge · 种子数独锻造炉

一个**单文件、零依赖、可离线运行**的数独工具：输入任意文字或数字作为「种子」，
确定性地生成一道数独谜题，并保证**唯一解**；内置求解器与实时校验。

> 本仓库由 WorkBuddy 按「随机创新项目」管线自动生成：build → 无头验证 → 推送 GitHub。

## 特性

- **种子可复现**：同一个种子永远生成同一道题（`hashStr → mulberry32` 确定性 PRNG）。
- **唯一解保证**：生成时逐格挖空，并用解计数（上限 2）确保每道题恰有一个解。
- **难度可调**：滑块控制保留提示数（22–45），越小学越难。
- **实时校验**：输入即高亮同行/列/宫冲突（红色）。
- **一键求解 / 校验**：填入唯一解，或校验当前作答是否等于正解。
- **纯前端**：无网络请求、无构建步骤，双击 `index.html` 即用。

## 验证

引擎（`index.html` 内 `<script id="engine">`）无 DOM 依赖，可在 Node 无头运行：

```bash
node _smoke.js   # 315 个种子 × 确定性 / solve==solution / 唯一解 断言
node _probe.js   # 导出样例谜面与正解到 _probe.txt
```

最近一次验证：**PASS 649 / 649 · ALL GREEN**（含 300 个随机种子）。

## 引擎 API（`globalThis.SF`）

| 函数 | 说明 |
| --- | --- |
| `generate(seed, targetGivens)` | 返回 `{seed, puzzle, solution, givens}`，保证唯一解 |
| `solve(grid)` | 回溯求解，返回正解数组或 `null` |
| `countSolutions(grid, limit)` | 统计解的数量（上限 `limit`） |
| `canPlace / fillGrid / hashStr / mulberry32` | 底层原语 |

## 文件

- `index.html` — 完整工具（引擎 + UI，单文件）
- `_smoke.js` / `_probe.js` — 无头验证脚本（不参与运行时）
- `LICENSE` — MIT © 晨星

## License

MIT © 晨星
