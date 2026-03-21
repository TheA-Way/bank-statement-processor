<div align="center">

```
██████╗  █████╗ ███╗   ██╗██╗  ██╗
██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝
██████╔╝███████║██╔██╗ ██║█████╔╝ 
██╔══██╗██╔══██║██║╚██╗██║██╔═██╗
██████╔╝██║  ██║██║ ╚████║██║  ██╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
                                    
    S T A T E M E N T  A N A L Y Z E R
```

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Upload+a+PDF.;See+where+your+money+goes.;Sort.+Group.+Visualize." alt="Typing SVG" />

<br/>

[![Live Demo](https://img.shields.io/badge/◈_Live_Demo-6366f1?style=for-the-badge&logoColor=white)](https://bank-statement-processor.vercel.app)
[![API Docs](https://img.shields.io/badge/◈_API_Docs-10b981?style=for-the-badge&logoColor=white)](https://bank-statement-api.onrender.com/docs)
[![Made With Love](https://img.shields.io/badge/made_with-♥-ec4899?style=for-the-badge)](https://github.com/TheA-Way)

<br/>

<img src="https://skillicons.dev/icons?i=nextjs,typescript,python,postgres&theme=dark" />

<br/><br/>

> *your bank statement, but make it make sense*

<br/>

</div>

---

<div align="center">

## ◈ &nbsp; what it does &nbsp; ◈

</div>

<br/>

```
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │   drop a pdf  ──▶  extracts every transaction  ──▶  table  │
  │                                                             │
  │   sort by merchant  or  amount                              │
  │   group purchases from the same place together              │
  │   expand a group to see each individual purchase            │
  │   switch to pie chart view — one slice per merchant         │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘
```

<br/>

---

<div align="center">

## ◈ &nbsp; features &nbsp; ◈

</div>

<br/>

<table align="center">
  <tr>
    <td align="center" width="200">
      <br/>
      <b>⬆ drag & drop</b>
      <br/><br/>
      <sub>just drop your pdf.<br/>no account needed.</sub>
      <br/><br/>
    </td>
    <td align="center" width="200">
      <br/>
      <b>⬡ smart parsing</b>
      <br/><br/>
      <sub>turns "AMZN MKTP US*XK92F"<br/>into "Amazon"</sub>
      <br/><br/>
    </td>
    <td align="center" width="200">
      <br/>
      <b>↕ sort & group</b>
      <br/><br/>
      <sub>collapse 8 amazon orders<br/>into one row with total</sub>
      <br/><br/>
    </td>
    <td align="center" width="200">
      <br/>
      <b>◔ pie chart</b>
      <br/><br/>
      <sub>see your spending<br/>visually by merchant</sub>
      <br/><br/>
    </td>
  </tr>
</table>

<br/>

---

<div align="center">

## ◈ &nbsp; stack &nbsp; ◈

</div>

<br/>

```
  frontend                    backend                     infra
  ─────────────────           ─────────────────           ──────────────
  Next.js 14                  Python 3.11                 Vercel
  TypeScript                  FastAPI                     Render
  Tailwind CSS                pdfplumber                  PostgreSQL
  Recharts                    Pydantic                    GitHub Actions
```

<br/>

---

<div align="center">

## ◈ &nbsp; how it works &nbsp; ◈

</div>

<br/>

```
  ╔══════════════╗     POST /process-statement      ╔══════════════════╗
  ║              ║  ──────────────────────────────▶  ║                  ║
  ║   browser    ║         PDF file upload           ║  fastapi backend ║
  ║              ║                                   ║                  ║
  ║   next.js    ║  ◀──────────────────────────────  ║  pdfplumber      ║
  ║              ║         JSON transactions          ║  + regex parser  ║
  ╚══════════════╝                                   ╚══════════════════╝
         │                                                    │
         ▼                                                    ▼
  ┌─────────────┐                                    ┌──────────────────┐
  │    table    │                                    │   postgresql     │
  │   + chart   │                                    │   (statement     │
  │    views    │                                    │    history)      │
  └─────────────┘                                    └──────────────────┘
```

<br/>

---

<div align="center">

## ◈ &nbsp; get it running &nbsp; ◈

</div>

<br/>

**clone**
```bash
git clone https://github.com/TheA-Way/bank-statement-processor.git
cd bank-statement-processor
```

**backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**frontend**
```bash
cd frontend
npm install
npm run dev
```

then open &nbsp;`localhost:3000` &nbsp;and &nbsp;`localhost:8000/docs`

<br/>

---

<div align="center">

## ◈ &nbsp; project structure &nbsp; ◈

</div>

<br/>

```
  bank-statement-processor/
  │
  ├── backend/
  │   ├── app/
  │   │   ├── main.py              ← fastapi app & routes
  │   │   ├── pdf_processor.py     ← pdf parsing + regex
  │   │   ├── models.py            ← pydantic data shapes
  │   │   └── database.py          ← postgresql connection
  │   └── requirements.txt
  │
  └── frontend/
      ├── app/
      │   └── page.tsx             ← main page
      ├── components/
      │   ├── FileUpload.tsx        ← drag & drop upload
      │   ├── TransactionTable.tsx  ← sortable grouped table
      │   └── SpendingChart.tsx     ← recharts pie chart
      ├── lib/
      │   └── api.ts               ← backend api client
      └── types/
          └── index.ts             ← typescript interfaces
```

<br/>

---

<div align="center">

## ◈ &nbsp; note on pdf compatibility &nbsp; ◈

<br/>

<sub>bank statement pdfs vary a lot by bank. this works best with text-based pdfs<br/>(not scanned images). if your bank's format isn't recognized out of the box,<br/>the regex patterns in <code>pdf_processor.py</code> are where to make adjustments.<br/>the fastapi docs at <code>/docs</code> let you test uploads interactively.</sub>

<br/><br/>

---

<sub>mit license &nbsp;·&nbsp; made by <a href="https://github.com/TheA-Way">TheA-Way</a></sub>

<br/>

```
  if it helped, drop a ⭐
```

</div>