#!/usr/bin/env node
/**
 * Antigravity 简体中文汉化插件 —— 安装器
 *
 * 原理：Antigravity 的界面是一个由本地 language_server 提供的 Web 应用，
 * 由 Electron 主进程通过 preload 注入到每个窗口。本安装器把翻译脚本
 * (zhcn.js) 放进 resources/app.asar 的 dist 目录，并在 dist/preload.js
 * 末尾追加一行加载语句，从而在每个窗口载入时自动汉化 DOM。
 *
 * 安装前会把原始 app.asar 备份为 app.asar.zhcn-backup，
 * 卸载器可据此完整还原。
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

const MENU_MAP = {
  'New Window': '新建窗口',
  'Zoom In': '放大',
  'Docs': '文档',
  'Connect to WSL': '连接到 WSL',
  'Reopen Locally': '在本地重新打开'
};

function resolveAppDir() {
  const candidates = [
    process.env.ANTIGRAVITY_HOME,
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'antigravity'),
    'C:\\Program Files\\Antigravity'
  ].filter(Boolean);
  for (const dir of candidates) {
    const asarPath = path.join(dir, 'resources', 'app.asar');
    if (fs.existsSync(asarPath)) return dir;
  }
  throw new Error('找不到 Antigravity 安装目录，可用 ANTIGRAVITY_HOME 指定。');
}

function patchMenu(js) {
  let out = js;
  for (const [en, zh] of Object.entries(MENU_MAP)) {
    const esc = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`label:\\s*(['"])${esc}\\1`, 'g'), (m, q) => `label: ${q}${zh}${q}`);
  }
  return out;
}

const appDir = resolveAppDir();
const asarPath = path.join(appDir, 'resources', 'app.asar');
const backupPath = asarPath + BACKUP_SUFFIX;

console.log('[zh-cn] Antigravity:', appDir);

// 1) 备份（只备份一次，保留最初的原版）
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(asarPath, backupPath);
  console.log('[zh-cn] 已备份原始 app.asar →', path.basename(backupPath));
} else {
  console.log('[zh-cn] 已存在备份，跳过备份');
}

// 2) 解包
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'antigravity-zhcn-'));
asar.extractAll(asarPath, work);
const distDir = path.join(work, 'dist');
const preloadPath = path.join(distDir, 'preload.js');
const zhcnDest = path.join(distDir, 'zhcn.js');

if (!fs.existsSync(preloadPath)) throw new Error('解包后未找到 dist/preload.js');

let preload = fs.readFileSync(preloadPath, 'utf8');
if (preload.includes(MARKER)) {
  // 重复安装：先移除旧注入块
  preload = preload.replace(/\n?\/\* antigravity-zh-cn \*\/[\s\S]*?\/\* antigravity-zh-cn-end \*\/\n?/g, '\n');
}

// 3) 放入翻译脚本（同时留一份文件，便于阅读/调试）
const zhcnSource = fs.readFileSync(path.join(import.meta.dirname, 'package', 'dist', 'zhcn.js'), 'utf8');
fs.writeFileSync(zhcnDest, zhcnSource, 'utf8');

// 4) 在 preload 末尾内联翻译脚本。
//    注意：Electron 的沙箱化 preload 只允许 require('electron')，
//    不能 require 相对路径文件，因此这里必须内联而不是引用。
preload += `\n${MARKER}\n;(function(){ try {\n${zhcnSource}\n} catch (e) { console.error('[zh-cn] 注入失败', e); } })();\n/* antigravity-zh-cn-end */\n`;
fs.writeFileSync(preloadPath, preload, 'utf8');

// 5) 顺带汉化原生菜单文案
const menuPath = path.join(distDir, 'menu.js');
if (fs.existsSync(menuPath)) {
  const before = fs.readFileSync(menuPath, 'utf8');
  const after = patchMenu(before);
  if (after !== before) fs.writeFileSync(menuPath, after, 'utf8');
}

// 6) 重新打包
await asar.createPackage(work, asarPath);
const stat = fs.statSync(asarPath);
console.log('[zh-cn] 已重新打包 app.asar，大小', (stat.size / 1024 / 1024).toFixed(2), 'MB');

// 7) 校验
const files = asar.listPackage(asarPath);
const hasZhcn = files.some((f) => f.replace(/\\/g, '/').toLowerCase().includes('dist/zhcn.js'));
console.log('[zh-cn] 校验注入成功:', hasZhcn ? '是' : '否');

fs.rmSync(work, { recursive: true, force: true });
console.log('[zh-cn] 安装完成。请完全退出 Antigravity 后重新打开。');
