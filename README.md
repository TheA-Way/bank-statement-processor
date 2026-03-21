<div align="center">

<pre>
██████╗  █████╗ ███╗   ██╗██╗  ██╗
██╔══██╗██╔══██╗████╗  ██║██║ ██╔╝
██████╔╝███████║██╔██╗ ██║█████╔╝ 
██╔══██╗██╔══██║██║╚██╗██║██╔═██╗
██████╔╝██║  ██║██║ ╚████║██║  ██╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
                                    
    S T A T E M E N T  A N A L Y Z E R
</pre>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Upload+a+PDF.;See+where+your+money+goes.;Sort.+Group.+Visualize." alt="Typing SVG" />

<br/>

<img src="https://skillicons.dev/icons?i=nextjs,typescript,python,postgres&theme=dark" />

</div>

---

<div align="center">


# Bank Statement Analyzer

**Turn messy PDF bank statements into clean, interactive spending dashboards.**

> [!CAUTION]
> This is a project, please don't upload sensitive details like real bank statements with account information. Test PDFs have been provided.

**Try it Now: [https://bank-statement-processor-inky.vercel.app/](https://bank-statement-processor-inky.vercel.app/)**


## ✨ Features

- **PDF Upload** — Drag-and-drop any bank statement PDF
- **Smart Parsing** — Automatically extracts merchants, dates, and amounts
- **Merchant Normalization** — "AMZN MKTP US\*XK92F" becomes "Amazon"
- **Sortable Table** — Sort by merchant name or transaction amount
- **Grouped View** — Collapse multiple Amazon purchases into one row showing total
- **Expandable Groups** — Click a group to see all individual transactions, sorted largest-first
- **Pie Chart** — Visual spending breakdown by merchant
- **Clean UI** — Fast, responsive design that works on mobile and desktop

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | UI framework with server-side rendering |
| Styling | Tailwind CSS | Utility-first CSS |
| Charts | Recharts | Pie chart visualization |
| Backend | Python + FastAPI | REST API, PDF processing |
| PDF Parsing | pdfplumber | Text extraction from PDF files |
| Database | PostgreSQL | Persistent storage of past statements |
| Deployment | Vercel (frontend) + Render (backend) | Cloud hosting |
| Version Control | GitHub | Source control + CI/CD trigger |

## In Progress
Persistent storage of past statements