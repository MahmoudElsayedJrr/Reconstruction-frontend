/**
 * Searchable Dropdown Component for Sinai Project
 * Works with classic script tags and ES Modules.
 */
(function (global) {
  "use strict";

  // In-memory cache for fetched entities
  var _entityCache = {
    company: null,
    consultant: null,
  };

  function getApiBaseUrl() {
    if (typeof API_URL !== "undefined" && API_URL) {
      return API_URL.replace(/\/$/, "");
    }
    return "http://localhost:3000";
  }

  function getAuthToken() {
    return localStorage.getItem("loggedInUserToken") || "";
  }

  /**
   * Fetch entities (companies / consultants) from API
   */
  async function fetchEntityOptions(entityType) {
    if (_entityCache[entityType]) {
      return _entityCache[entityType];
    }

    var baseUrl = getApiBaseUrl();
    var token = getAuthToken();

    try {
      var res = await fetch(baseUrl + "/" + entityType + "?isActive=true", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        return [];
      }

      var data = await res.json();
      var list = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.companies)
        ? data.companies
        : Array.isArray(data.consultants)
        ? data.consultants
        : [];

      _entityCache[entityType] = list;
      return list;
    } catch (err) {
      console.warn("[SearchableDropdown] Failed to fetch " + entityType + ":", err);
      return [];
    }
  }

  function invalidateEntityCache(entityType) {
    if (entityType) {
      _entityCache[entityType] = null;
    } else {
      _entityCache.company = null;
      _entityCache.consultant = null;
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Initialize a Searchable Dropdown
   */
  function initSearchableDropdown(options) {
    var target = options.target;
    var inputId = options.inputId;
    var name = options.name || inputId;
    var entityType = options.entityType || "company";
    var placeholder = options.placeholder || "اختر...";
    var searchPlaceholder = options.searchPlaceholder || "بحث في القائمة...";
    var initialValue = options.initialValue ? String(options.initialValue).trim() : "";
    var isDisabled = Boolean(options.disabled);
    var icon = options.icon || (entityType === "consultant" ? "fa-user-tie" : "fa-building");
    var onChange = options.onChange;

    var targetEl = typeof target === "string" ? document.getElementById(target) : target;
    if (!targetEl) {
      console.warn("[SearchableDropdown] Target element not found:", target);
      return null;
    }

    var items = [];
    var currentValue = initialValue;

    // Create wrapper element
    var wrapper = document.createElement("div");
    wrapper.className = "searchable-dropdown";
    wrapper.id = inputId + "-dropdown-wrapper";

    wrapper.innerHTML =
      '<input type="hidden" id="' + inputId + '" name="' + name + '" value="' + escapeHtml(currentValue) + '" />' +
      '<button type="button" class="searchable-dropdown-toggle ' + (currentValue ? "has-value" : "") + ' ' + (isDisabled ? "disabled" : "") + '" aria-expanded="false" ' + (isDisabled ? "disabled" : "") + '>' +
      '  <div class="selected-content">' +
      '    <i class="fas ' + icon + '"></i>' +
      '    <span class="selected-text ' + (currentValue ? "" : "sdd-placeholder") + '">' + (currentValue ? escapeHtml(currentValue) : escapeHtml(placeholder)) + '</span>' +
      '  </div>' +
      '  <div class="toggle-actions">' +
      '    <span class="btn-clear-selection" title="مسح الاختيار" role="button">' +
      '      <i class="fas fa-times"></i>' +
      '    </span>' +
      '    <i class="fas fa-chevron-down toggle-arrow"></i>' +
      '  </div>' +
      '</button>' +
      '<div class="searchable-dropdown-menu">' +
      '  <div class="searchable-dropdown-search-wrapper">' +
      '    <div class="searchable-dropdown-search-inner">' +
      '      <i class="fas fa-search search-icon"></i>' +
      '      <input type="text" class="searchable-dropdown-search-input" placeholder="' + escapeHtml(searchPlaceholder) + '" autocomplete="off" />' +
      '    </div>' +
      '  </div>' +
      '  <ul class="searchable-dropdown-list">' +
      '    <li class="searchable-dropdown-state">' +
      '      <span class="spinner-border spinner-border-sm text-primary" role="status"></span>' +
      '      <span>جاري تحميل الخيارات...</span>' +
      '    </li>' +
      '  </ul>' +
      '</div>';

    // Replace target input or insert into container
    if (targetEl.tagName === "INPUT") {
      targetEl.parentNode.replaceChild(wrapper, targetEl);
    } else {
      targetEl.innerHTML = "";
      targetEl.appendChild(wrapper);
    }

    var hiddenInput = wrapper.querySelector("#" + inputId);
    var toggleBtn = wrapper.querySelector(".searchable-dropdown-toggle");
    var selectedTextEl = wrapper.querySelector(".selected-text");
    var clearBtn = wrapper.querySelector(".btn-clear-selection");
    var searchInput = wrapper.querySelector(".searchable-dropdown-search-input");
    var listEl = wrapper.querySelector(".searchable-dropdown-list");

    function renderList(query) {
      query = (query || "").trim().toLowerCase();
      var filtered = items;

      if (query) {
        filtered = items.filter(function (item) {
          return (item.name || "").toLowerCase().indexOf(query) !== -1;
        });
      }

      listEl.innerHTML = "";

      // Option: No Selection / Clear
      if (!query) {
        var noneItem = document.createElement("li");
        noneItem.className = "searchable-dropdown-item " + (!currentValue ? "selected" : "");
        noneItem.innerHTML =
          '<span class="item-title">' +
          '  <i class="fas fa-times-circle text-muted"></i>' +
          "  <span>-- بدون تحديد --</span>" +
          "</span>" +
          '<i class="fas fa-check item-check"></i>';

        noneItem.addEventListener("click", function () {
          selectValue("");
          closeDropdown();
        });
        listEl.appendChild(noneItem);
      }

      var exactMatch = false;

      if (filtered.length > 0) {
        filtered.forEach(function (item) {
          var isSelected = item.name === currentValue;
          if ((item.name || "").toLowerCase() === query) {
            exactMatch = true;
          }

          var li = document.createElement("li");
          li.className = "searchable-dropdown-item " + (isSelected ? "selected" : "");
          li.innerHTML =
            '<span class="item-title">' +
            '  <i class="fas ' + icon + '"></i>' +
            "  <span>" + escapeHtml(item.name) + "</span>" +
            "</span>" +
            '<i class="fas fa-check item-check"></i>';

          li.addEventListener("click", function () {
            selectValue(item.name);
            closeDropdown();
          });
          listEl.appendChild(li);
        });
      }

      // If search query is entered and not in list, allow using custom value
      if (query && !exactMatch) {
        var customLi = document.createElement("li");
        customLi.className = "searchable-dropdown-item custom-option";
        customLi.innerHTML =
          '<span class="item-title">' +
          '  <i class="fas fa-plus-circle"></i>' +
          '  <span>استخدام "<strong>' + escapeHtml(searchInput.value.trim()) + '</strong>"</span>' +
          "</span>" +
          '<i class="fas fa-check item-check"></i>';

        customLi.addEventListener("click", function () {
          selectValue(searchInput.value.trim());
          closeDropdown();
        });
        listEl.appendChild(customLi);
      } else if (filtered.length === 0 && !query) {
        var emptyLi = document.createElement("li");
        emptyLi.className = "searchable-dropdown-state";
        emptyLi.innerHTML =
          '<i class="fas fa-folder-open"></i>' +
          "<span>لا توجد خيارات متاحة</span>";
        listEl.appendChild(emptyLi);
      }
    }

    function selectValue(val) {
      currentValue = (val || "").trim();
      hiddenInput.value = currentValue;
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));

      if (currentValue) {
        selectedTextEl.textContent = currentValue;
        selectedTextEl.classList.remove("sdd-placeholder");
        toggleBtn.classList.add("has-value");
      } else {
        selectedTextEl.textContent = placeholder;
        selectedTextEl.classList.add("sdd-placeholder");
        toggleBtn.classList.remove("has-value");
      }

      if (typeof onChange === "function") {
        onChange(currentValue);
      }
    }

    function openDropdown() {
      if (isDisabled) return;

      document.querySelectorAll(".searchable-dropdown.open").forEach(function (d) {
        if (d !== wrapper) d.classList.remove("open");
      });

      wrapper.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
      searchInput.value = "";
      renderList("");
      setTimeout(function () {
        searchInput.focus();
      }, 50);
    }

    function closeDropdown() {
      wrapper.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    function toggleDropdown() {
      if (wrapper.classList.contains("open")) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    toggleBtn.addEventListener("click", function (e) {
      if (e.target.closest(".btn-clear-selection")) {
        e.stopPropagation();
        selectValue("");
        return;
      }
      toggleDropdown();
    });

    clearBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      selectValue("");
    });

    searchInput.addEventListener("input", function (e) {
      renderList(e.target.value);
    });

    function onDocClick(e) {
      if (!wrapper.contains(e.target)) {
        closeDropdown();
      }
    }
    document.addEventListener("click", onDocClick);

    wrapper.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdown();
        toggleBtn.focus();
      }
    });

    async function loadData() {
      if (Array.isArray(entityType)) {
        items = entityType;
      } else {
        items = await fetchEntityOptions(entityType);
      }

      if (currentValue) {
        selectValue(currentValue);
      } else if (wrapper.classList.contains("open")) {
        renderList(searchInput.value);
      }
    }

    loadData();

    return {
      getValue: function () {
        return currentValue;
      },
      setValue: function (val) {
        selectValue(val);
      },
      setDisabled: function (disable) {
        isDisabled = Boolean(disable);
        hiddenInput.disabled = isDisabled;
        if (isDisabled) {
          toggleBtn.classList.add("disabled");
          toggleBtn.setAttribute("disabled", "disabled");
          closeDropdown();
        } else {
          toggleBtn.classList.remove("disabled");
          toggleBtn.removeAttribute("disabled");
        }
      },
      refresh: function () {
        invalidateEntityCache(typeof entityType === "string" ? entityType : null);
        loadData();
      },
      destroy: function () {
        document.removeEventListener("click", onDocClick);
        wrapper.remove();
      },
    };
  }

  // Export to global scope
  global.initSearchableDropdown = initSearchableDropdown;
  global.fetchEntityOptions = fetchEntityOptions;
  global.invalidateEntityCache = invalidateEntityCache;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      initSearchableDropdown: initSearchableDropdown,
      fetchEntityOptions: fetchEntityOptions,
      invalidateEntityCache: invalidateEntityCache,
    };
  }
})(typeof window !== "undefined" ? window : this);
