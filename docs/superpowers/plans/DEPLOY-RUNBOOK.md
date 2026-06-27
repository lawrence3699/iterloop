# iterloop 官网部署 Runbook

域名：**iter-loop.com**（裸域 / apex） · 仓库：`lawrence3699/iterloop` · 站点源码：`site/`

GitHub Actions 工作流 `.github/workflows/deploy-site.yml` 会在推送到 `main`（改动 `site/**`）或手动触发时，构建 `site/` 并部署到 GitHub Pages。以下是无法用代码完成、需要在 GitHub 设置和域名注册商处手动操作的步骤。

## 1. 合并到 main
把 `feat/landing-site` 分支合并到 `main`（PR 或直接推送）。`site/**` 的改动会触发 `Deploy site` 工作流。

## 2. 打开 Pages 并指定源
仓库 **Settings → Pages → Build and deployment → Source = "GitHub Actions"**。
（也可用 API：`gh api -X POST repos/lawrence3699/iterloop/pages -f build_type=workflow`）

## 3. 确认首次部署成功
`gh run watch`（或在 Actions 页查看 `Deploy site` 变绿）。绿了之后，站点会先在 `https://lawrence3699.github.io/...` 或 Pages 默认 URL 可访问。

## 4. 绑定自定义域名
> 注意：用 **GitHub Actions 部署**时，`dist/CNAME` **不会**自动设置仓库的自定义域名（那是旧的"从分支部署"才有的行为）。必须显式设置：
> ```
> gh api -X PUT repos/lawrence3699/iterloop/pages -f cname=iter-loop.com
> ```
> （本项目已执行，`gh api repos/lawrence3699/iterloop/pages` 可见 `cname: iter-loop.com`。）证书签发后再启用 Enforce HTTPS。

## 5. 配置 DNS —— iter-loop.com 在 **Cloudflare**（nameserver: *.ns.cloudflare.com）
在 Cloudflare 控制台 → 该域名 → **DNS → Records** 操作。

**推荐方案 A：DNS-only（灰云），让 GitHub 自动签发 HTTPS**
1. 删除现有指向 Cloudflare 的 `@` A/AAAA 记录（当前是橙云代理）。
2. 新增 4 条 A 记录（名称 `@`，**Proxy status = DNS only / 灰云**）：
   ```
   A  @  185.199.108.153
   A  @  185.199.109.153
   A  @  185.199.110.153
   A  @  185.199.111.153
   ```
3. （可选 IPv6）4 条 AAAA（灰云）：`2606:50c0:8000::153` / `8001::153` / `8002::153` / `8003::153`
4. （可选）`CNAME  www  lawrence3699.github.io`（灰云）。

**方案 B：保留 Cloudflare 代理（橙云，用 CF 的 CDN/SSL）**
- 同样设 4 条 `185.199.108–111.153` 的 A 记录，但保持橙云代理；
- Cloudflare **SSL/TLS 模式设为 Full**（不要 Flexible）；
- 此时 GitHub 无法验证域名，**不要**在 GitHub 勾选 Enforce HTTPS（由 Cloudflare 提供边缘证书）。

简单起见推荐 **方案 A**。

## 6. 验证
- `dig +short iter-loop.com` → 应返回上面 4 个 A 记录。
- `curl -I https://iter-loop.com` → DNS 传播 + 证书签发后返回 `200`。
- 浏览器打开 `https://iter-loop.com`，确认中英文、终端动画、复制按钮均正常。

> 说明：DNS 传播通常几分钟到数小时；GitHub 对 apex 自定义域名的 HTTPS 证书签发也可能需要等待一段时间。期间页面可能短暂出现证书警告，属正常现象。
