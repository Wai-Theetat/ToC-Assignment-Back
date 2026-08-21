# Bank App — Data Masking with Regex

Web application สำหรับจำลองระบบธนาคาร โดยเน้นการ mask ข้อมูลส่วนตัว (บัตรเครดิต, อีเมล, เบอร์โทร, วันเกิด, ที่อยู่) ด้วย Regular Expression

## Tech Stack

- **Frontend:** Next.js
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL (ผ่าน Docker)

## Project Structure

```
TOC_assignment/
├── docker-compose.yml          # PostgreSQL container
├── backend/
│   ├── .env.example            # ตัวอย่าง config (copy เป็น .env)
│   ├── requirements.txt        # Python dependencies
│   └── app/
│       ├── main.py             # FastAPI entry point
│       ├── database.py         # Database connection
│       ├── models/models.py    # Database tables (User, Transaction)
│       ├── schemas/schemas.py  # Request/Response format
│       ├── services/masking.py # Regex masking functions
│       └── routers/
│           ├── auth.py         # POST /auth/register, /auth/login
│           ├── users.py        # GET/PUT/DELETE /users/{id}
│           └── transactions.py # deposit, withdraw, history
└── frontend/                   # Next.js (แยก folder)
```

## Setup (ครั้งแรก)

ต้องมี [Docker Desktop](https://www.docker.com/products/docker-desktop/) และ Python 3.9+ ติดตั้งในเครื่อง

```bash
# 1. Clone repo
git clone <repo-url>
cd TOC_assignment

# 2. Start PostgreSQL
docker compose up -d

# 3. Setup Backend
cd backend
cp .env.example .env
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 4. Run Backend Server
uvicorn app.main:app --reload
```

เปิด http://localhost:8080/docs จะเห็น Swagger UI สำหรับทดสอบ API ทั้งหมด

## Run (ครั้งถัดไป)

```bash
# Terminal 1 — Database
docker compose up -d

# Terminal 2 — Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | สมัครสมาชิก |
| POST | `/auth/login` | เข้าสู่ระบบ |
| GET | `/users/{user_id}` | ดูโปรไฟล์ (ข้อมูลถูก mask) |
| PUT | `/users/{user_id}` | แก้ไขข้อมูลผู้ใช้ |
| DELETE | `/users/{user_id}` | ลบผู้ใช้ |
| GET | `/transactions/{user_id}/balance` | ดูยอดเงิน |
| POST | `/transactions/{user_id}/deposit` | ฝากเงิน |
| POST | `/transactions/{user_id}/withdraw` | ถอนเงิน |
| GET | `/transactions/{user_id}/history` | ดูประวัติธุรกรรม |

## Frontend เชื่อม Backend ยังไง

Backend รันที่ `http://localhost:8080` และมี CORS เปิดให้ `http://localhost:3000` (Next.js) เรียกได้

### ตัวอย่าง: สมัครสมาชิก

```javascript
const res = await fetch("http://localhost:8080/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "somchai",
    password: "1234",
    email: "somchai.d@company.com",
    tel: "093-245-7894",
    date_of_birth: "25/12/2549",
    address: "689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ",
    credit_card: "1234-5678-9012-3456"
  }),
});
const data = await res.json();
```

### ตัวอย่าง: ดูโปรไฟล์ (ข้อมูลถูก mask แล้ว)

```javascript
const res = await fetch("http://localhost:8080/users/1");
const profile = await res.json();
// {
//   "username": "somchai",
//   "email": "s*******d@company.com",
//   "tel": "XXX-XXX-7894",
//   "date_of_birth": "XX/XX/25XX",
//   "address": "XXX ซอยลาดกระบัง 19 ถนนลาดกระบัง ...",
//   "credit_card": "XXXX-XXXX-XXXX-3456"
// }
```

### ตัวอย่าง: ฝากเงิน

```javascript
const res = await fetch("http://localhost:8080/transactions/1/deposit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 500 }),
});
const result = await res.json();
```

### ตัวอย่าง: ดูประวัติธุรกรรม

```javascript
const res = await fetch("http://localhost:8080/transactions/1/history");
const history = await res.json();
// [
//   {
//     "credit_card": "XXXX-XXXX-XXXX-3456",
//     "old_money": 0,
//     "updated_money": 500,
//     "transaction_amount": 500,
//     "status": "deposit",
//     "created_at": "2026-08-21T12:00:00"
//   }
// ]
```

## Data Masking (Regex)

ข้อมูลส่วนตัวถูก mask ก่อนส่งให้ Frontend:

| Field | ข้อมูลจริง | หลัง Mask |
|-------|-----------|-----------|
| Credit Card | `1234-5678-9012-3456` | `XXXX-XXXX-XXXX-3456` |
| Email | `somchai.d@company.com` | `s*******d@company.com` |
| Tel | `093-245-7894` | `XXX-XXX-7894` |
| DOB | `25/12/2549` | `XX/XX/25XX` |
| Address | `689 ซอยลาดกระบัง...` | `XXX ซอยลาดกระบัง...` |
