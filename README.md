# farhanadityaramadhan.github.io

Personal portfolio website for Farhan Aditya Ramadhan (Adin), built with [Quarto](https://quarto.org/) and deployed via GitHub Pages.

**Live site:** [farhanadityaramadhan.github.io](https://farhanadityaramadhan.github.io)

---

## About

This site serves as a centralized portfolio for academic work, data analysis projects, and curated learning resources. The content spans four areas: research papers and working papers, applied econometric analysis, blog writing, and a playground for experimental work.

The site also hosts a resources section with curated reading lists and notes covering R, Stata, macroeconomics, econometrics, and causal inference.

---

## Tech Stack

- **Framework** — [Quarto](https://quarto.org/) (v1.x)
- **Deployment** — GitHub Pages (`docs/` folder)
- **Styling** — Custom CSS on top of the Cosmo Bootstrap theme
- **Analytics** — Google Analytics (GA4)
- **Fonts** — Source Sans Pro
- **Icons** — Bootstrap Icons, Font Awesome

---

## Project Structure
```
.
├── index.qmd                             # Homepage with carousels
├── about.qmd                             # About page
├── head.html                             # Custom scripts injected into every page
├── styles.css                            # Site-wide custom CSS
├── _quarto.yml                           # Quarto project configuration
├── LICENSE                               # MIT License (source code)
├── src/
│   └── quarto-listing-multiselect.js    # Custom listing JS (multi-select categories)
├── tools/
│   └── fix-listing.bat                  # Post-render script to apply custom listing JS
├── webpages/
│   ├── projects/
│   │   ├── analysis/                    # Individual analysis post .qmd files
│   │   ├── research/                    # Individual research post .qmd files
│   │   ├── blog/                        # Individual blog post .qmd files
│   │   ├── playground/                  # Individual playground post .qmd files
│   │   ├── analysis.qmd                 # Analysis listing page
│   │   ├── research.qmd                 # Research listing page
│   │   ├── blog.qmd                     # Blog listing page
│   │   ├── playground.qmd               # Playground listing page
│   │   └── projects.qmd                 # All projects combined listing page
│   ├── resources/
│   │   ├── rstudio/                     # Individual R & RStudio resource .qmd files
│   │   ├── stata/                       # Individual Stata resource .qmd files
│   │   ├── macro/                       # Individual macroeconomics resource .qmd files
│   │   ├── econometrics/                # Individual econometrics resource .qmd files
│   │   ├── causalinference/             # Individual causal inference resource .qmd files
│   │   ├── rstudio.qmd                  # R & RStudio listing page
│   │   ├── stata.qmd                    # Stata listing page
│   │   ├── macro.qmd                    # Macroeconomics listing page
│   │   ├── econometrics.qmd             # Econometrics listing page
│   │   ├── causalinference.qmd          # Causal inference listing page
│   │   └── resources.qmd                # All resources combined listing page
│   └── graphics/
│       ├── graphics.qmd                 # Graphics listing page
│       └── ...                          # Individual graphic .qmd files
├── docs/                                # Rendered output (deployed to GitHub Pages)
├── files/                               # Static files (CV, PDFs)
├── fonts/                               # Self-hosted fonts
├── images/                              # Site images
└── fontawesome/                         # Font Awesome assets
```

---

## Local Development

### Prerequisites

- [Quarto CLI](https://quarto.org/docs/get-started/) installed
- R and RStudio (optional, for rendering R-based documents)

### Running Locally
```bash
# Preview the site with live reload
quarto preview

# Render the full site
quarto render
```

After rendering, the `fix-listing.bat` post-render script runs automatically and replaces Quarto's default `quarto-listing.js` with the custom multi-select version in `src/`.

---

## Custom Features

### Multi-Select Category Filtering

Quarto's default category filtering only supports single selection. This site replaces the bundled `quarto-listing.js` with a custom version in `src/quarto-listing-multiselect.js` that enables multi-select filtering. Clicking multiple category pills filters the listing to show items matching any selected category.

### Graphics for Exploration

The homepage includes a two-column "Graphics for Exploration" section with a dark navy panel on the left and a scrollable card list on the right. Cards are auto-populated from `.qmd` files via Quarto's listing system and support pagination via up/down arrow buttons.

### Language Filter

Each post supports a `lang:English` or `lang:Indonesian` category prefix. The site separates these visually in the sidebar into a dedicated Language section, which operates independently from the main category filter.

### Homepage Carousels

The homepage displays each project section as a horizontally scrollable carousel with custom JavaScript handling card sizing, navigation arrows, and responsive layout.

---

## Adding New Content

### New Project or Blog Post

Create a new `.qmd` file inside the relevant folder (`webpages/projects/analysis/`, `research/`, `blog/`, or `playground/`). The listing pages pick it up automatically on the next render.

The front matter should follow this pattern:
```yaml
---
title: "Your Title"
subtitle: "A short subtitle"
description: "A one-sentence description for the listing card."
date: 2026-01-01
image: /images/your-image.jpg
categories: [Econometrics, Policy, lang:Indonesian]
---
```

### New Resource

Create a new `.qmd` file inside the relevant resource subfolder (`webpages/resources/rstudio/`, `stata/`, etc.) and follow the same front matter pattern above.

---

## Deployment

After rendering locally, commit and push the `docs/` folder to deploy to GitHub Pages.
```bash
quarto render
git add docs/
git commit -m "update site"
git push
```

---

## License

The source code (all files outside `webpages/` and `files/`) is licensed under the [MIT License](LICENSE).

Written content under `webpages/` and `files/` — including blog posts, research, and analysis — is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You may share and adapt it with attribution, but not for commercial purposes.

---

## Contact

- Email: adin.ramaadin@gmail.com
- LinkedIn: [linkedin.com/in/adinramaadin](https://www.linkedin.com/in/adinramaadin/)
- Location: Jakarta, Indonesia
