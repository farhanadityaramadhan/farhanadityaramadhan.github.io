# farhanadityaramadhan.github.io

Personal portfolio website for Farhan Aditya Ramadhan (Adin), built with [Quarto](https://quarto.org/) and deployed via GitHub Pages.

**Live site:** [farhanadityaramadhan.github.io](https://farhanadityaramadhan.github.io)

---

## About

I am an economics graduate from Universitas Indonesia. My work sits at the intersection of macroeconomics, political economy, and development economics, with a focus on causal inference and applied econometrics. I use Stata, R, and Python as my primary tools.

This site hosts my research projects, data analysis work, and writing, alongside curated resources for R, Stata, econometrics, causal inference, and macroeconomics.

---

## Site Structure

```
.
├── index.qmd                      # Homepage (overview + listing carousels)
├── about.qmd                      # About page
├── styles.css                     # Custom CSS
├── _quarto.yml                    # Site configuration
├── head.html                      # Custom HTML injected into <head>
├── webpages/
│   ├── projects/
│   │   ├── analysis/              # Data analysis posts
│   │   ├── research/              # Research projects
│   │   ├── blog/                  # Blog posts
│   │   ├── analysis.qmd           # Analysis listing page
│   │   ├── research.qmd           # Research listing page
│   │   └── blog.qmd               # Blog listing page
│   └── resources/
│       ├── rstudio.qmd
│       ├── stata.qmd
│       ├── macro.qmd
│       ├── econometrics.qmd
│       └── causalinference.qmd
├── files/
│   └── CV/                        # CV PDF
├── images/
│   └── icons/
└── fonts/
```

---

## Tech Stack

| Tool | Role |
|---|---|
| [Quarto](https://quarto.org/) | Static site framework |
| Bootstrap (via Cosmo theme) | Base layout and components |
| Custom CSS (`styles.css`) | Design system and overrides |
| GitHub Pages | Hosting (`docs/` output directory) |

---

## Building Locally

**Prerequisites:** [Quarto CLI](https://quarto.org/docs/get-started/) installed.

```bash
# Clone the repo
git clone https://github.com/farhanadityaramadhan/farhanadityaramadhan.github.io.git
cd farhanadityaramadhan.github.io

# Preview locally with live reload
quarto preview

# Build to docs/
quarto render
```

The site renders to `docs/`, which GitHub Pages serves directly from the `main` branch.

---

## Content Areas

**Analysis** — applied data work using Indonesian microdata (SUSENAS, SAKERNAS) and macroeconomic datasets, primarily in Stata and R.

**Research** — longer-form projects, including undergraduate thesis work on fiscal origins of democracy (2SLS, V-Dem data) and labor market analysis for persons with functional limitations.

**Blog** — shorter pieces on economics, methodology, and tools.

**Resources** — curated reading lists and notes covering R and RStudio, Stata, macroeconomics, econometrics, and causal inference.

---

## Contact

- Email: adin.ramaadin@gmail.com
- LinkedIn: [linkedin.com/in/adinramaadin](https://www.linkedin.com/in/adinramaadin/)
- Location: Jakarta, Indonesia
