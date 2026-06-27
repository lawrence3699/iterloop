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
**Settings → Pages → Custom domain** 填 `iter-loop.com` → Save；证书签发后勾选 **Enforce HTTPS**。
（`site/public/CNAME` 已包含 `iter-loop.com`，每次部署都会写入 `dist/`，所以域名不会在重新部署时丢失。）

## 5. 配置 DNS（在 iter-loop.com 的域名注册商处）
apex 裸域指向 GitHub Pages 的 4 个 A 记录 + 4 个 AAAA 记录：

```
类型    名称   值
A       @     185.199.108.153
A       @     185.199.109.153
A       @     185.199.110.153
A       @     185.199.111.153
AAAA    @     2606:50c0:8000::153
AAAA    @     2606:50c0:8001::153
AAAA    @     2606:50c0:8002::153
AAAA    @     2606:50c0:8003::153
```

可选：把 `www` 也指过去（便于 `www.iter-loop.com` 访问）：
```
CNAME   www   lawrence3699.github.io.
```

## 6. 验证
- `dig +short iter-loop.com` → 应返回上面 4 个 A 记录。
- `curl -I https://iter-loop.com` → DNS 传播 + 证书签发后返回 `200`。
- 浏览器打开 `https://iter-loop.com`，确认中英文、终端动画、复制按钮均正常。

> 说明：DNS 传播通常几分钟到数小时；GitHub 对 apex 自定义域名的 HTTPS 证书签发也可能需要等待一段时间。期间页面可能短暂出现证书警告，属正常现象。
