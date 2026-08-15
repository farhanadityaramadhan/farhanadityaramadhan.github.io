/*
  Fork of Quarto's bundled site_libs/quarto-listing/quarto-listing.js.
  It is copied over the bundled file by tools/fix-listing.bat, which runs
  as a post-render step (see _quarto.yml). Two behaviours are added on top
  of the upstream file:

    1. Multi-select category filtering — upstream allows one active category.
    2. "lang:" categories filter as an independent second axis, so a language
       pill and a topic pill can be active at the same time.

  Keep the exported entry points (window.quartoListingCategory and
  window["quarto-listing-loaded"]) matching upstream — Quarto's generated
  page markup calls them directly.
*/

const kProgressiveAttr = "data-src";
let categoriesLoaded = false;
let selectedCategories = new Set(); // regular categories only
let selectedLanguages = new Set();  // lang: categories only
let previousCategories = new Set(); // saved state before "All" clicked
const kDefaultCategory = "";

/* Quarto base64-encodes category names into the data-category attribute. */
function readPillCategory(pillEl) {
  return decodeURIComponent(atob(pillEl.getAttribute("data-category")));
}

/* Seed the two selection sets from the URL hash, then repaint and refilter.
   Falls back to "All" when the hash carries no category state. */
function restoreSelectionFromHash(hash) {
  if (hash && hash.categories) {
    for (const cat of hash.categories.split(",")) {
      if (!cat) continue;
      const decoded = decodeURIComponent(cat);
      if (decoded.startsWith("lang:")) {
        selectedLanguages.add(decoded);
      } else {
        selectedCategories.add(decoded);
      }
    }
  } else {
    selectedCategories.add(kDefaultCategory);
  }
  updateCategoryUI();
  filterListingCategories();
}

window.quartoListingCategory = (category) => {
  category = decodeURIComponent(atob(category));
  if (categoriesLoaded) {
    if (category.startsWith("lang:")) {
      toggleLanguage(category);
    } else {
      activateCategory(category);
    }
    setCategoryHash();
  }
};

window["quarto-listing-loaded"] = () => {
  const hash = getHash();
  restoreSelectionFromHash(hash);

  if (hash) {
    for (const listingId of Object.keys(window["quarto-listings"])) {
      const page = hash[getListingPageKey(listingId)];
      if (page) showPage(listingId, page);
    }
  }

  const listingIds = Object.keys(window["quarto-listings"]);
  for (const listingId of listingIds) {
    const list = window["quarto-listings"][listingId];
    refreshPaginationHandlers(listingId);
    renderVisibleProgressiveImages(list);
    list.on("updated", function () {
      renderVisibleProgressiveImages(list);
      setTimeout(() => refreshPaginationHandlers(listingId));
      toggleNoMatchingMessage(list);
    });
  }
};

window.document.addEventListener("DOMContentLoaded", function (_event) {
  const categoryEls = window.document.querySelectorAll(
    ".quarto-listing-category .category"
  );

  for (const categoryEl of categoryEls) {
    const category = readPillCategory(categoryEl);

    if (category.startsWith("lang:")) {
      // ── LANGUAGE PILL — fully independent, never affected by All ──
      categoryEl.onclick = () => {
        toggleLanguage(category);
        setCategoryHash();
      };

    } else if (category === kDefaultCategory) {
      // ── ALL PILL — toggle with save/restore ──
      categoryEl.onclick = () => {
        if (selectedCategories.has(kDefaultCategory)) {
          // Unclick All — restore previous selection
          selectedCategories.clear();
          for (const cat of previousCategories) {
            selectedCategories.add(cat);
          }
          previousCategories = new Set();
        } else {
          // Click All — save current selection, then set All
          previousCategories = new Set(selectedCategories);
          selectedCategories.clear();
          selectedCategories.add(kDefaultCategory);
        }
        updateCategoryUI();
        setCategoryHash();
        filterListingCategories();
      };

    } else {
      // ── REGULAR CATEGORY PILL ──
      categoryEl.onclick = () => {
        // If All was active, clear it and start fresh (don't restore previous)
        if (selectedCategories.has(kDefaultCategory)) {
          selectedCategories.clear();
          previousCategories = new Set();
        }
        activateCategory(category);
        setCategoryHash();
      };
    }
  }

  restoreSelectionFromHash(getHash());

  categoriesLoaded = true;
});

function toggleLanguage(lang) {
  if (selectedLanguages.has(lang)) {
    selectedLanguages.delete(lang);
  } else {
    selectedLanguages.add(lang);
  }
  updateCategoryUI();
  filterListingCategories();
}

function activateCategory(category) {
  if (selectedCategories.has(category)) {
    selectedCategories.delete(category);
  } else {
    selectedCategories.add(category);
  }
  updateCategoryUI();
  filterListingCategories();
}

function updateCategoryUI() {
  const allPills = window.document.querySelectorAll(
    ".quarto-listing-category .category"
  );

  // "All" highlights every topic pill but leaves language pills untouched.
  const allTopicsActive = selectedCategories.has(kDefaultCategory);

  for (const pill of allPills) {
    const category = readPillCategory(pill);
    const isActive = category.startsWith("lang:")
      ? selectedLanguages.has(category)
      : allTopicsActive || selectedCategories.has(category);
    pill.classList.toggle("active", isActive);
  }
}

function filterListingCategories() {
  if (!window["quarto-listings"]) return;
  const listingIds = Object.keys(window["quarto-listings"]);
  const hasLangFilter = selectedLanguages.size > 0;
  const hasCatFilter = !(
    selectedCategories.size === 0 ||
    (selectedCategories.size === 1 && selectedCategories.has(kDefaultCategory))
  );

  for (const listingId of listingIds) {
    const list = window["quarto-listings"][listingId];
    if (!list) continue;

    if (!hasCatFilter && !hasLangFilter) {
      list.filter();
    } else {
      list.filter(function (item) {
        const itemValues = item.values();
        if (itemValues.categories === null) return false;

        const itemCategories = decodeURIComponent(
          atob(itemValues.categories)
        ).split(",");

        const itemRegularCats = itemCategories.filter(c => !c.startsWith("lang:"));
        const itemLangs = itemCategories.filter(c => c.startsWith("lang:"));

        let catMatch = true;
        if (hasCatFilter) {
          catMatch = itemRegularCats.some(c => selectedCategories.has(c));
        }

        let langMatch = true;
        if (hasLangFilter) {
          langMatch = itemLangs.some(l => selectedLanguages.has(l));
        }

        return catMatch && langMatch;
      });
    }
  }
}

function toggleNoMatchingMessage(list) {
  const selector = `#${list.listContainer.id} .listing-no-matching`;
  const noMatchingEl = window.document.querySelector(selector);
  if (noMatchingEl) {
    noMatchingEl.classList.toggle("d-none", list.visibleItems.length > 0);
  }
}

function setCategoryHash() {
  const all = [
    ...Array.from(selectedCategories),
    ...Array.from(selectedLanguages)
  ];
  if (all.length === 0) {
    setHash({});
  } else {
    const categoriesStr = all.map((cat) => encodeURIComponent(cat)).join(",");
    setHash({ categories: categoriesStr });
  }
}

function setPageHash(listingId, page) {
  const currentHash = getHash() || {};
  currentHash[getListingPageKey(listingId)] = page;
  setHash(currentHash);
}

function getListingPageKey(listingId) {
  return `${listingId}-page`;
}

function refreshPaginationHandlers(listingId) {
  const listingEl = window.document.getElementById(listingId);
  const paginationEls = listingEl.querySelectorAll(
    ".pagination li.page-item:not(.disabled) .page.page-link"
  );
  for (const paginationEl of paginationEls) {
    paginationEl.onclick = (sender) => {
      setPageHash(listingId, sender.target.getAttribute("data-i"));
      showPage(listingId, sender.target.getAttribute("data-i"));
      return false;
    };
  }
}

function renderVisibleProgressiveImages(list) {
  for (const item of list.visibleItems) {
    const itemEl = item.elm;
    if (itemEl) {
      const progressiveImgs = itemEl.querySelectorAll(`img[${kProgressiveAttr}]`);
      for (const progressiveImg of progressiveImgs) {
        const srcValue = progressiveImg.getAttribute(kProgressiveAttr);
        if (srcValue) progressiveImg.setAttribute("src", srcValue);
        progressiveImg.removeAttribute(kProgressiveAttr);
      }
    }
  }
}

function getHash() {
  const currentUrl = new URL(window.location);
  const hashRaw = currentUrl.hash ? currentUrl.hash.slice(1) : undefined;
  return parseHash(hashRaw);
}

const kAnd = "&";
const kEquals = "=";

function parseHash(hash) {
  if (!hash) return undefined;
  const hasValuesStrs = hash.split(kAnd);
  const hashValues = hasValuesStrs
    .map((hashValueStr) => {
      const vals = hashValueStr.split(kEquals);
      if (vals.length === 2) return { name: vals[0], value: vals[1] };
      else return undefined;
    })
    .filter((value) => value !== undefined);

  const hashObj = {};
  hashValues.forEach((hashValue) => {
    hashObj[hashValue.name] = decodeURIComponent(hashValue.value);
  });
  return hashObj;
}

function makeHash(obj) {
  return Object.keys(obj)
    .map((key) => `${key}${kEquals}${obj[key]}`)
    .join(kAnd);
}

function setHash(obj) {
  const hash = makeHash(obj);
  window.history.pushState(null, null, `#${hash}`);
}

function showPage(listingId, page) {
  const list = window["quarto-listings"][listingId];
  if (list) list.show((page - 1) * list.page + 1, list.page);
}