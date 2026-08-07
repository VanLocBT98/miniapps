# Quy trình: Import docs → chạy code

> **Bạn chỉ cần làm 2 việc:** (1) bỏ docs vào đúng chỗ, (2) nhắn agent một câu.  
> Agent + `pnpm req:*` làm phần còn lại.

---

## 1. Bạn làm gì (product / bạn)

### A. Project đã có sẵn (`booking`, `portfolio`, …)

1. Sửa / thêm file trong `docs/projects/<id>/`:
   - Spec chi tiết → `requirements/00-….md` (hoặc pack bạn paste vào)
   - Việc cần **code** → `requirements/ACTIONS.md` (queue `- [ ]`)
   - Living ngắn → `REQUIREMENTS.md` (north star + link pack)
2. Trong chat Cursor, **@** folder docs đó (hoặc file `PROCESS.md` này) rồi gửi:

```text
chạy requirements <id>
```

Ví dụ: `chạy requirements booking`

### B. Project mới

```bash
cp -R docs/projects/_TEMPLATE docs/projects/<id>
# đổi tên trong file, điền REQUIREMENTS + requirements/* + ACTIONS.md
```

Rồi: `chạy requirements <id>`

### C. Dừng giữa chừng

```text
dừng requirements
```

hoặc `pnpm req:stop`

---

## 2. Cấu trúc docs (bắt buộc nhớ)

```text
docs/projects/<id>/
├── REQUIREMENTS.md              ← ngắn: hiện tại + tương lai gần
├── CHANGELOG.md                 ← lịch sử (agent ghi)
└── requirements/
    ├── 00-overview.md …         ← spec (được dài)
    ├── ACTIONS.md               ← QUEUE CHẠY ĐƯỢC (quan trọng)
    └── 11-todo.md               ← optional checklist mirror
```

| File | Ai viết | Khi nào sửa |
|------|---------|-------------|
| `REQUIREMENTS.md` | Bạn | Đổi hướng / focus |
| `requirements/*.md` | Bạn (import spec) | Spec lớn theo chủ đề |
| `ACTIONS.md` | Bạn (hoặc agent sinh từ todo) | Thêm/bớt bước implement |
| `CHANGELOG.md` | **Agent** | Sau mỗi ACTION |

**REQUIREMENTS không chứa lịch sử** — việc đã xong → CHANGELOG; prune living file.

---

## 3. Format `ACTIONS.md` (để agent chạy được)

```markdown
---
runMode: manual
---

## Queue

### my-action-id
- [ ] Tiêu đề ngắn
- read: `04-data-model.md`, `07-business-rules.md`
- do: Làm đúng việc này (1 ACTION = 1 slice)
```

Quy tắc:

- `### id` = id duy nhất (dùng cho `pnpm req:done <id> <actionId>`)
- `- [ ]` → chưa làm; `- [x]` → xong
- `read:` file trong cùng `requirements/`
- `do:` chỉ thị implement (1 bước rõ ràng)

---

## 4. Agent làm gì (tự động)

Khi bạn nói **`chạy requirements <id>`**:

```text
pnpm req:start <id>
        ↓
Lấy ACTION đầu tiên chưa tick
        ↓
Đọc file trong `read:` + living REQUIREMENTS
        ↓
Implement đúng 1 ACTION (không nhảy cóc)
        ↓
pnpm req:done <id> <actionId>
+ ghi CHANGELOG + tick 11-todo (nếu có)
        ↓
Stop turn → stop-hook gửi ACTION kế tiếp
        ↓
… lặp đến hết queue hoặc bạn `dừng requirements`
```

CLI bạn có thể tự xem:

```bash
pnpm req:status
pnpm req:next booking
pnpm req:start booking
pnpm req:done booking folder-structure
pnpm req:stop
```

State run: `.req/req-run.json` (gitignored).

---

## 5. Câu chat mẫu (copy)

| Mục đích | Chat |
|----------|------|
| Chạy hết queue | `chạy requirements booking` |
| Chỉ làm 1 bước rồi dừng | `làm ACTION tiếp theo của booking rồi dừng` |
| Import spec mới rồi chạy | `@docs/projects/booking/requirements` cập nhật theo file này rồi `chạy requirements booking` |
| Dừng auto | `dừng requirements` |
| Xem còn gì | `pnpm req:status` (hoặc hỏi agent status) |

---

## 6. Map project

| id | code | docs |
|----|------|------|
| `booking` | `projects/booking` | `docs/projects/booking/` |
| `portfolio` | `projects/portfolio` | `docs/projects/portfolio/` |
| `dashboard` | `projects/dashboard` | `docs/projects/dashboard/` |
| `admin` | `projects/admin` | `docs/projects/admin/` |

Platform contract vẫn là root `AGENTS.md` (architecture). Product scope = docs project.

---

## 7. Checklist “import docs xong chưa?”

- [ ] Có `docs/projects/<id>/REQUIREMENTS.md`
- [ ] Có `docs/projects/<id>/requirements/ACTIONS.md` với ít nhất 1 `- [ ]`
- [ ] Spec chi tiết nằm trong `requirements/*.md` (nếu dài)
- [ ] Chat: `chạy requirements <id>` (có thể @ folder docs)

Xong — không cần giải thích lại quy trình mỗi lần.
