# Per-project docs

> **Quy trình đầy đủ (đọc cái này trước):** [`PROCESS.md`](./PROCESS.md)  
> Sau này bạn chỉ **import docs** + chat `chạy requirements <id>`.

| File | Mục đích |
|------|----------|
| [`PROCESS.md`](./PROCESS.md) | Quy trình import → chạy |
| `<id>/REQUIREMENTS.md` | Living (ngắn) |
| `<id>/requirements/*.md` | Spec theo chủ đề |
| `<id>/requirements/ACTIONS.md` | Queue chạy được |
| `<id>/CHANGELOG.md` | Lịch sử |
| `_TEMPLATE/` | Copy khi tạo project docs mới |

```bash
pnpm req:status
pnpm req:start <id>    # hoặc chat: chạy requirements <id>
pnpm req:stop
```

| id | package |
|----|---------|
| `portfolio` | `@repo/portfolio` |
| `dashboard` | `@repo/dashboard` |
| `admin` | `@repo/admin` |
| `booking` | `@repo/booking` |
