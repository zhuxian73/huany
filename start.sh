#!/bin/bash

# ============================================
# huany 项目自动启动脚本
# 功能：检查环境 → 安装依赖 → 启动开发服务器
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目路径（脚本所在目录的 client 子目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/client"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}       huany 项目启动脚本${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# ---------- 1. 环境检查 ----------
echo -e "${YELLOW}[1/4] 检查运行环境...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}错误：未检测到 Node.js，请先安装 Node.js (建议 v18+)${NC}"
    echo -e "下载地址：https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误：未检测到 npm，请随 Node.js 一起安装${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}  Node.js 版本：${NODE_VERSION}${NC}"
echo -e "${GREEN}  npm 版本：${NPM_VERSION}${NC}"
echo ""

# ---------- 2. 目录检查 ----------
echo -e "${YELLOW}[2/4] 检查项目目录...${NC}"

if [ ! -d "$CLIENT_DIR" ]; then
    echo -e "${RED}错误：未找到前端目录 $CLIENT_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}  项目目录：$CLIENT_DIR${NC}"
echo ""

# ---------- 3. 依赖安装 ----------
echo -e "${YELLOW}[3/4] 检查依赖...${NC}"

cd "$CLIENT_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  首次运行，正在安装依赖（可能需要几分钟）...${NC}"
    npm install
    echo -e "${GREEN}  依赖安装完成！${NC}"
else
    echo -e "${GREEN}  依赖已存在，跳过安装${NC}"
fi
echo ""

# ---------- 4. 启动项目 ----------
echo -e "${YELLOW}[4/4] 启动开发服务器...${NC}"
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  项目即将启动，请稍候...${NC}"
echo -e "${GREEN}  启动后请在浏览器访问：http://localhost:8077${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}  按 Ctrl+C 可停止服务${NC}"
echo ""

npm run dev
