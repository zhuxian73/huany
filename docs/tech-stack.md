# 技术栈说明

## 前端
- **框架**: React 19
- **构建工具**: Vite 8
- **样式**: Tailwind CSS (原子化 CSS)
- **依赖**:
  - `marked`: Markdown 渲染
  - `tailwindcss`, `postcss`, `autoprefixer`

## 部署
- **容器化**: Docker
- **编排**: Docker Compose
- **Web 服务器**: Nginx (Alpine)

### 部署说明
1. Docker 配置文件维护在根目录的 `docker/` 文件夹中。
2. 使用根目录下的 `docker-compose.yml` 进行统一管理。
3. 执行 `docker-compose up --build -d` 即可启动项目。
