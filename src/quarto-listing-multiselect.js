const kProgressiveAttr = "data-src";
let categoriesLoaded = false;
let selectedCategories = new Set(); // regular categories only
let selectedLanguages = new Set();  // lang: categories only
let previousCategories = new Set(); // saved state before "All" clicked
const kDefaultCategory = "";

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
  if (hash) {
    if (hash.categories) {
      const cats = hash.categories.split(",");
      for (const cat of cats) {
        if (cat) {
          const decoded = decodeURIComponent(cat);
          if (decoded.startsWith("lang:")) {
            selectedLanguages.add(decoded);
          } else {
            selectedCategories.add(decoded);
          }
        }
      }
      updateCategoryUI();
      filterListingCategories();
    } else {
      selectedCategories.add(kDefaultCategory);
      updateCategoryUI();
      filterListingCategories();
    }
    const listingIds = Object.keys(window["quarto-listings"]);
    for (const listingId of listingIds) {
      const page = hash[getListingPageKey(listingId)];
      if (page) showPage(listingId, page);
    }
  } else {
    selectedCategories.add(kDefaultCategory);
    updateCategoryUI();
    filterListingCategories();
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
    const category = decodeURIComponent(
      atob(categoryEl.getAttribute("data-category"))
    );

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

  const hash = getHash();
  if (hash && hash.categories) {
    const cats = hash.categories.split(",");
    for (const cat of cats) {
      if (cat) {
        const decoded = decodeURIComponent(cat);
        if (decoded.startsWith("lang:")) {
          selectedLanguages.add(decoded);
        } else {
          selectedCategories.add(decoded);
        }
      }
    }
    updateCategoryUI();
    filterListingCategories();
  } else {
    selectedCategories.add(kDefaultCategory);
    updateCategoryUI();
    filterListingCategories();
  }

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

  // Deactivate all first
  for (const pill of allPills) {
    pill.classList.remove("active");
  }

  // Activate regular + All pills
  for (const pill of allPills) {
    const raw = decodeURIComponent(atob(pill.getAttribute("data-category")));
    if (raw.startsWith("lang:")) continue; // handled separately

    if (selectedCategories.has(kDefaultCategory)) {
      // All is active — highlight all non-lang pills
      pill.classList.add("active");
    } else if (selectedCategories.has(raw)) {
      pill.classList.add("active");
    }
  }

  // Activate language pills independently
  for (const pill of allPills) {
    const raw = decodeURIComponent(atob(pill.getAttribute("data-category")));
    if (!raw.startsWith("lang:")) continue;
    if (selectedLanguages.has(raw)) {
      pill.classList.add("active");
    }
  }
}

function filterListingCategories() {
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
    if (list.visibleItems.length === 0) {
      noMatchingEl.classList.remove("d-none");
    } else {
      if (!noMatchingEl.classList.contains("d-none")) {
        noMatchingEl.classList.add("d-none");
      }
    }
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