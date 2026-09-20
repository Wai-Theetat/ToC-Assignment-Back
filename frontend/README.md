# toc-assignment-front

Frontend สำหรับงาน TOC assignment สร้างด้วย [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript และ Tailwind CSS v4

> โปรเจกต์นี้ใช้ **pnpm เท่านั้น** อย่าใช้ `npm` หรือ `yarn` เพราะจะทำให้เกิด lockfile ซ้ำซ้อนและเวอร์ชัน dependency ไม่ตรงกัน

## ความต้องการของระบบ

| อย่าง | เวอร์ชัน |
| --- | --- |
| Node.js | >= 20.9.0 (แนะนำ LTS ล่าสุด) |
| pnpm | 10.33.0 (ระบุไว้ใน `packageManager`) |

ตรวจเวอร์ชัน:

```bash
node -v
pnpm -v
```

## ติดตั้ง pnpm

วิธีที่แนะนำคือใช้ Corepack ที่มากับ Node.js — จะได้ pnpm เวอร์ชันตรงกับที่ระบุใน `package.json` อัตโนมัติ

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

ถ้าไม่ใช้ Corepack:

```bash
# macOS / Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# หรือผ่าน Homebrew
brew install pnpm
```

## เริ่มต้นใช้งาน

1. Clone โปรเจกต์

   ```bash
   git clone <repo-url>
   cd toc-assignment-front
   ```

2. ติดตั้ง dependencies

   ```bash
   pnpm install
   ```

3. รัน development server

   ```bash
   pnpm dev
   ```

4. เปิด [http://localhost:3000](http://localhost:3000)

เปลี่ยนพอร์ตได้ด้วย `pnpm dev -p 4000` หรือ env `PORT=4000 pnpm dev`

## คำสั่งที่มี

| คำสั่ง | ทำอะไร |
| --- | --- |
| `pnpm dev` | รัน dev server (Turbopack + HMR) output ไป `.next/dev` |
| `pnpm build` | build โปรดักชัน output ไป `.next` |
| `pnpm start` | รันเซิร์ฟเวอร์โปรดักชัน (ต้อง `pnpm build` ก่อน) |
| `pnpm lint` | ตรวจโค้ดด้วย ESLint (flat config) |

## โครงสร้างโปรเจกต์

```
app/
  layout.tsx      # root layout + font
  page.tsx        # หน้าแรก (/)
  globals.css     # Tailwind v4 + CSS variables
  favicon.ico
public/           # static assets เสิร์ฟที่ /
next.config.ts    # config ของ Next.js
eslint.config.mjs # ESLint flat config
postcss.config.mjs# PostCSS + @tailwindcss/postcss
tsconfig.json
```

แก้หน้าแรกได้ที่ `app/page.tsx` หน้าเว็บจะ reload เองเมื่อบันทึกไฟล์

## Build โปรดักชันในเครื่อง

```bash
pnpm build
pnpm start
```

## หมายเหตุ

- Next.js 16 ใช้ **Turbopack เป็น bundler เริ่มต้น** ทั้งตอน dev และ build ถ้าต้องการ Webpack ให้ใส่ `--webpack`
- Next.js 16 ตัดคำสั่ง `next lint` ออกแล้ว สคริปต์ `lint` จึงเรียก `eslint` ตรง ๆ
- `pnpm-workspace.yaml` มี `ignoredBuiltDependencies` (`sharp`, `unrs-resolver`) เพื่อไม่ให้ pnpm รัน build script ของแพ็กเกจเหล่านั้น
- commit `pnpm-lock.yaml` เสมอ และติดตั้งใน CI ด้วย `pnpm install --frozen-lockfile`
