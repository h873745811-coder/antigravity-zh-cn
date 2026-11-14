#!/usr/bin/env node
/**
 * Antigravity 简体中文汉化插件 —— 卸载器
 * 优先用安装时保留的 app.asar.zhcn-backup 完整还原；
 * 若备份缺失，则尝试移除注入块并重新打包。
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const asar = require('@electron/asar');

const MARKER = '/* antigravity-zh-cn */';
const BACKUP_SUFFIX = '.zhcn-backup';

function resolveAppDir() {
  const candidates = [
    process.env.ANTIGRAVITY_HOME,
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'antigravity'),
    'C:\\Program Files\\Antigravity'
  ].filter(Boolean);
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'resources', 'app.asar'))) return dir;
  }
  throw new Error('找不到 Antigravity 安装目录。');
}

const appDir = resolveAppDir();
const asarPath = path.join(appDir, 'resources', 'app.asar');
const backupPath = asarPath + BACKUP_SUFFIX;

if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, asarPath);
  console.log('[zh-cn] 已从备份还原 app.asar');
  console.log('[zh-cn] 卸载完成。请完全退出 Antigravity 后重新打开。');
  process.exit(0);
}

// 无备份：尝试反向修补
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'antigravity-zhcn-'));
asar.extractAll(asarPath, work);
const preloadPath = path.join(work, 'dist', 'preload.js');
let preload = fs.readFileSync(preloadPath, 'utf8');
preload = preload.replace(/\n?\/\* antigravity-zh-cn \*\/[\s\S]*?\/\* antigravity-zh-cn-end \*\/\n?/g, '\n');
fs.writeFileSync(preloadPath, preload, 'utf8');
const zhcnPath = path.join(work, 'dist', 'zhcn.js');
if (fs.existsSync(zhcnPath)) fs.rmSync(zhcnPath);
await asar.createPackage(work, asarPath);
fs.rmSync(work, { recursive: true, force: true });
console.log('[zh-cn] 已移除注入内容（未找到备份）。');
