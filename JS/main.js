document.addEventListener("DOMContentLoaded", () => {
  const usernameDisplay = document.getElementById("username-display");
  const userRoleDisplay = document.getElementById("userRole");
  const logoutButton = document.getElementById("logout-button");

  const token = localStorage.getItem("loggedInUserToken");
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
    localStorage.removeItem("loggedInUserToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("loggedInUserRole");
    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
    return;
  }

  if (usernameDisplay) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("loggedInUserRole");

    const roleNames = {
      admin: "أدمن",
      manager: "تخطيط ومتابعة",
      executive: "تنفيذية",
      financial: "مالي",
      projectManager: "مشروعات",
      contractual: "تعاقدية",
      employee: "موظف",
    };

    usernameDisplay.textContent = loggedInUser || "";

    if (userRoleDisplay && role) {
      userRoleDisplay.textContent = roleNames[role] || role;
    }

    const addEmployeeLink = document.getElementById("addEmployeeLink");
    const updateAndRemoveEmployeeLink = document.getElementById(
      "updateAndRemoveEmployeeLink",
    );
    const addactivityLink = document.getElementById("addactivityLink");
    const budgetPageLink = document.getElementById("budgetPageLink");

    if (role === "admin") {
      addEmployeeLink && (addEmployeeLink.style.display = "block");
      updateAndRemoveEmployeeLink &&
        (updateAndRemoveEmployeeLink.style.display = "block");
      addactivityLink && (addactivityLink.style.display = "block");
      budgetPageLink && (budgetPageLink.style.display = "block");
    } else if (role === "manager") {
      addEmployeeLink && (addEmployeeLink.style.display = "none");
      updateAndRemoveEmployeeLink &&
        (updateAndRemoveEmployeeLink.style.display = "none");
      addactivityLink && (addactivityLink.style.display = "block");
      budgetPageLink && (budgetPageLink.style.display = "block");
    } else {
      addEmployeeLink && (addEmployeeLink.style.display = "none");
      updateAndRemoveEmployeeLink &&
        (updateAndRemoveEmployeeLink.style.display = "none");
      addactivityLink && (addactivityLink.style.display = "none");
      budgetPageLink && (budgetPageLink.style.display = "none");
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "login.html";
    });
  }

  let c =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : global,
    K_26978d = c["K_26978d"] || (c["K_26978d"] = {}),
    i = K_26978d;
  const r_e8e218 = (function () {
    let R = [
      {
        i: [
          0x0,
          0x0,
          0x5a,
          null,
          0x0,
          0x1,
          0x5b,
          null,
          0x0,
          0x2,
          0x5b,
          null,
          0x0,
          0x3,
          0x5b,
          null,
          0x4,
          null,
          0x46,
          0x4,
          0x0,
          0x5,
          0x37,
          0x1,
          0x38,
          null,
        ],
        c: [
          " ",
          "تم تطوير وهندسة النظام بالكامل بواسطة المهندس",
          "محمود السيد عبدالله",
          "تحت إشراف دكتور محمد طاحون",
          "join",
          0x1,
          "getOriginalSignature",
        ],
        p: 0x0,
        l: 0x0,
        ni: 0x6,
      },
      {
        i: [
          0x0,
          0x0,
          0x4b,
          0x1,
          0x4,
          null,
          0x46,
          0x2,
          0x0,
          0x3,
          0x37,
          0x1,
          0x7,
          0x0,
          0x6,
          0x0,
          0x20,
          null,
          0x34,
          null,
          0x4b,
          0x4,
          0x0,
          0x5,
          0x36,
          0x0,
          0x3,
          null,
          0x1,
          null,
          0x38,
          null,
          0xa2,
          0x70006,
          0x0,
          0x8,
          0x6,
          0x0,
          0x46,
          0x9,
          0x4,
          null,
          0x46,
          0xa,
          0x0,
          0xb,
          0x37,
          0x2,
          0x4,
          null,
          0x46,
          0xc,
          0x0,
          0x5,
          0x37,
          0x0,
          0x7,
          0x1,
          0x4b,
          0xd,
          0x0,
          0x5,
          0x36,
          0x0,
          0x7,
          0x2,
          0x0,
          0xe,
          0x6,
          0x1,
          0x4,
          null,
          0x46,
          0xf,
          0x0,
          0x3,
          0x37,
          0x1,
          0x20,
          null,
          0x4,
          null,
          0x33,
          null,
          0x3,
          null,
          0x0,
          0x10,
          0x6,
          0x1,
          0x4,
          null,
          0x46,
          0xf,
          0x0,
          0x3,
          0x37,
          0x1,
          0x20,
          null,
          0x34,
          null,
          0x4b,
          0x4,
          0x0,
          0x5,
          0x36,
          0x0,
          0x3,
          null,
        ],
        c: [
          "signature-container",
          "document",
          "getElementById",
          0x1,
          "lockSystem",
          0x0,
          "\\s+",
          "g",
          " ",
          "innerText",
          "replace",
          0x2,
          "trim",
          "getOriginalSignature",
          "محمود السيد",
          "includes",
          "تم تطوير وهندسة",
        ],
        p: 0x0,
        l: 0x3,
        j: { 0x9: 0x10, 0x29: 0x32, 0x32: 0x37 },
        a: 0x1,
      },
      {
        i: [
          0x4b,
          0x0,
          0x0,
          0x1,
          0x64,
          null,
          0x0,
          0x2,
          0x68,
          0x1,
          0x7,
          0x0,
          0x4b,
          0x3,
          0x46,
          0x4,
          0x4d,
          null,
          0x4,
          null,
          0x0,
          0x5,
          0x47,
          0x6,
          0x3,
          null,
          0x4,
          null,
          0x0,
          0x5,
          0x47,
          0x7,
          0x3,
          null,
          0x4,
          null,
          0x0,
          0x5,
          0x47,
          0x8,
          0x3,
          null,
          0x6,
          0x0,
          0x4,
          null,
          0x46,
          0x9,
          0x0,
          0xa,
          0x37,
          0x2,
          0x3,
          null,
          0x1,
          null,
          0x38,
          null,
        ],
        c: [
          "MutationObserver",
          0x1,
          0x1,
          "document",
          "body",
          !![],
          "childList",
          "subtree",
          "characterData",
          "observe",
          0x2,
          "observeSignature",
        ],
        p: 0x0,
        l: 0x1,
        ni: 0xb,
      },
      {
        i: [
          0x0,
          0x0,
          0x4b,
          0x1,
          0x4,
          null,
          0x46,
          0x2,
          0x0,
          0x3,
          0x37,
          0x1,
          0x7,
          0x0,
          0x6,
          0x0,
          0x20,
          null,
          0x34,
          null,
          0x0,
          0x4,
          0x4b,
          0x1,
          0x4,
          null,
          0x46,
          0x5,
          0x0,
          0x3,
          0x37,
          0x1,
          0x4,
          null,
          0x7,
          0x0,
          0x3,
          null,
          0x6,
          0x0,
          0x0,
          0x0,
          0x47,
          0x6,
          0x3,
          null,
          0x6,
          0x0,
          0x46,
          0x7,
          0x0,
          0x8,
          0x47,
          0x9,
          0x3,
          null,
          0x6,
          0x0,
          0x4b,
          0x1,
          0x46,
          0xa,
          0x4,
          null,
          0x46,
          0xb,
          0x0,
          0x3,
          0x37,
          0x1,
          0x3,
          null,
          0x6,
          0x0,
          0x0,
          0xc,
          0x47,
          0xd,
          0x3,
          null,
          0x1,
          null,
          0x38,
          null,
        ],
        c: [
          "signature-container",
          "document",
          "getElementById",
          0x1,
          "div",
          "createElement",
          "id",
          "style",
          "position:fixed;bottom:0;width:100%;background:#fff;text-align:center;padding:6px;border-top:1px solid #000;z-index:999;direction:rtl;font-size:14px;line-height:1.4;",
          "cssText",
          "body",
          "appendChild",
          "\n    <b>تم تطوير وهندسة النظام بالكامل بواسطة المهندس محمود السيد عبدالله</b>\n    <br/>\n    <span>تحت إشراف دكتور محمد طاحون</span>\n  ",
          "innerHTML",
          "createSignature",
        ],
        p: 0x0,
        l: 0x1,
        j: { 0x9: 0x24 },
        ni: 0xe,
      },
      {
        i: [
          0x4b,
          0x0,
          0x34,
          null,
          0x1,
          null,
          0x38,
          null,
          0x0,
          0x1,
          0x4,
          null,
          0x4c,
          0x0,
          0x3,
          null,
          0x3,
          null,
          0x4b,
          0x2,
          0x46,
          0x3,
          0x0,
          0x4,
          0x47,
          0x5,
          0x3,
          null,
          0x1,
          null,
          0x38,
          null,
        ],
        c: [
          "tamperTriggered",
          !![],
          "document",
          "body",
          '\n    <div style="\n      height:100vh;\n      display:flex;\n      align-items:center;\n      justify-content:center;\n      background:#000;\n      color:#fff;\n      text-align:center;\n      direction:rtl;\n    ">\n      <div>\n        <h1 style="color:red">⚠️ تم العبث بملفات النظام</h1>\n        <p>تم حذف أو تعديل حقوق الملكية الفكرية</p>\n        <p style="font-size:20px;font-weight:bold">\n          جميع الحقوق محفوظة للمهندس محمود السيد عبدالله\n        </p>\n      </div>\n    </div>\n  ',
          "innerHTML",
          "lockSystem",
        ],
        p: 0x0,
        l: 0x0,
        j: { 0x1: 0x4 },
        ni: 0x6,
      },
    ];
    function p(H) {
      return R[H];
    }
    for (let H = 0x0; H < R["length"]; H++) {
      let v = R[H];
      if (v["c"])
        for (let s = 0x0; s < v["c"]["length"]; s++) {
          let B = v["c"][s];
          if (
            typeof B === "string" &&
            B["length"] > 0x1 &&
            B[B["length"] - 0x1] === "n"
          )
            try {
              v["c"][s] = BigInt(B["slice"](0x0, -0x1));
            } catch (C) {}
        }
    }
    let M = {
        0x0: 0x137,
        0x1: 0x12b,
        0x2: 0x1ce,
        0x3: 0x85,
        0x4: 0x10,
        0x5: 0x155,
        0x6: 0x5e,
        0x7: 0x76,
        0x8: 0x10e,
        0x9: 0x18,
        0xa: 0xd6,
        0xb: 0x1a9,
        0xc: 0x51,
        0xd: 0x1f0,
        0xe: 0x1b8,
        0xf: 0x1b5,
        0x10: 0x16,
        0x11: 0x146,
        0x12: 0x198,
        0x13: 0x14f,
        0x14: 0x159,
        0x15: 0x199,
        0x16: 0x10a,
        0x17: 0x7b,
        0x18: 0x176,
        0x19: 0xb9,
        0x1a: 0x184,
        0x1b: 0x181,
        0x20: 0x73,
        0x28: 0x33,
        0x29: 0x7e,
        0x2a: 0x29,
        0x2b: 0xd2,
        0x2c: 0x16b,
        0x2d: 0x1fb,
        0x2e: 0x0,
        0x2f: 0x1c4,
        0x32: 0xa1,
        0x33: 0x1b6,
        0x34: 0x154,
        0x35: 0x1a5,
        0x36: 0x143,
        0x37: 0x11,
        0x38: 0x1fa,
        0x39: 0x120,
        0x3a: 0x1d0,
        0x3b: 0x1ed,
        0x3c: 0x111,
        0x3d: 0x1c5,
        0x3e: 0xe8,
        0x3f: 0xe2,
        0x40: 0x145,
        0x41: 0x4b,
        0x46: 0x6d,
        0x47: 0x194,
        0x48: 0x1ad,
        0x49: 0x4a,
        0x4a: 0x178,
        0x4b: 0x4,
        0x4c: 0x86,
        0x4d: 0x1f6,
        0x4e: 0x110,
        0x4f: 0x36,
        0x50: 0x10f,
        0x51: 0x16f,
        0x52: 0x8c,
        0x5a: 0x197,
        0x5b: 0xd5,
        0x5c: 0xc0,
        0x5d: 0x9a,
        0x5e: 0x1e0,
        0x64: 0x1a3,
        0x65: 0x1a0,
        0x66: 0x28,
        0x67: 0x26,
        0x68: 0x108,
        0x69: 0x35,
        0x6a: 0x1bc,
        0x6b: 0x1d2,
        0x6e: 0xfc,
        0x6f: 0xc8,
        0x70: 0x1aa,
        0x78: 0x6,
        0x79: 0x18f,
        0x7a: 0x1dd,
        0x7b: 0x9,
        0x7c: 0x19a,
        0x7d: 0xf7,
        0x7e: 0xef,
        0x7f: 0x1f5,
        0x80: 0x14e,
        0x81: 0x31,
        0x82: 0x180,
        0x83: 0x189,
        0x84: 0x13c,
        0x8c: 0x17d,
        0x8d: 0xbe,
        0x8e: 0x1f2,
        0x8f: 0x134,
        0x90: 0x45,
        0x91: 0x6f,
        0x92: 0x1ee,
        0x93: 0x149,
        0x94: 0x17b,
        0x95: 0x140,
        0x96: 0xc2,
        0x97: 0x38,
        0x98: 0x19d,
        0x99: 0xa9,
        0x9a: 0x14a,
        0x9b: 0x132,
        0x9c: 0xd1,
        0x9d: 0x2b,
        0x9e: 0x1ff,
        0xa0: 0x75,
        0xa1: 0x151,
        0xa2: 0x70,
        0xa3: 0xb8,
        0xa4: 0x5c,
        0xa6: 0x98,
        0xa7: 0x192,
        0xa8: 0x12c,
        0xa9: 0x84,
        0xaa: 0x2a,
        0xab: 0x144,
        0xac: 0xdf,
        0xad: 0x1b1,
        0xae: 0x16d,
        0xaf: 0x102,
        0xc8: 0xf9,
        0xc9: 0x107,
        0xca: 0x153,
        0xd2: 0x11e,
        0xd3: 0x1b7,
        0xd4: 0x93,
        0xd5: 0x18b,
        0xd6: 0x1b0,
        0xd7: 0x72,
        0xd8: 0xc6,
        0xd9: 0x1a8,
        0xda: 0x8d,
        0xfa: 0xa,
        0xfb: 0x11a,
        0xfc: 0x4d,
        0xfd: 0x1d3,
        0xfe: 0x1a2,
        0xff: 0x121,
        0x100: 0x95,
        0x101: 0x13d,
        0x102: 0x1c3,
        0x103: 0x1c2,
        0x104: 0x1,
        0x105: 0x179,
      },
      o = new WeakSet();
    function z(S, k) {
      let I = [];
      for (let N = 0x0; N < k; N++) {
        let U = S();
        if (U && typeof U === "object" && o["has"](U)) {
          let O = U["value"];
          if (Array["isArray"](O))
            for (let f = O["length"] - 0x1; f >= 0x0; f--) {
              I["push"](O[f]);
            }
        } else I["push"](U);
      }
      return (I["reverse"](), I);
    }
    function V(S) {
      let I = [];
      for (let N in S) {
        I["push"](N);
      }
      return I;
    }
    let j = ![],
      h = 0x0,
      t = 0x0,
      X = ![],
      D = 0x1388,
      F = 0x3;
    function g() {
      if (!j || X) return;
      let S = Date["now"]();
      if (h === 0x0) {
        h = S;
        return;
      }
      let I = S - h;
      h = S;
      if (I > D) {
        t++;
        if (t >= F) {
          X = !![];
          for (let N in M) {
            M[N] = (M[N] + 0x1) & 0x1ff;
          }
        }
      } else t = 0x0;
    }
    function Y(S, k, I, N, U, O) {
      let f = [],
        T = 0x0,
        W = new Array((S["p"] || 0x0) + (S["l"] || 0x0)),
        a = 0x0,
        J = S["c"],
        L = S["i"],
        u = S["j"] || {},
        b = S["x"] || {},
        Z = L["length"] >> 0x1,
        E0 = [],
        E1 = null,
        E2 = { hasReturn: ![], value: undefined },
        E3 = { hasBreak: ![], target: 0x0 },
        E4 = { hasContinue: ![], target: 0x0 },
        E5 = S["o"] || M;
      var E6 = 0x0,
        E7 = null;
      let E8 = S["seKey"],
        E9,
        EE,
        Em,
        EA,
        EQ,
        Er;
      if (E8 !== undefined) {
        let EM = (Eo) =>
          typeof Eo === "number" &&
          Number["isFinite"](Eo) &&
          Number["isInteger"](Eo) &&
          Eo >= -0x80000000 &&
          Eo <= 0x7fffffff
            ? (Eo ^ E8) | 0x0
            : Eo;
        ((E9 = (Eo) => {
          f[T++] = EM(Eo);
        }),
          (EE = () => EM(f[--T])),
          (Em = () => EM(f[T - 0x1])),
          (EA = (Eo) => {
            f[T - 0x1] = EM(Eo);
          }),
          (EQ = (Eo) => EM(f[T - Eo])),
          (Er = (Eo, Ez) => {
            f[T - Eo] = EM(Ez);
          }));
      } else
        ((E9 = (Eo) => {
          f[T++] = Eo;
        }),
          (EE = () => f[--T]),
          (Em = () => f[T - 0x1]),
          (EA = (Eo) => {
            f[T - 0x1] = Eo;
          }),
          (EQ = (Eo) => f[T - Eo]),
          (Er = (Eo, Ez) => {
            f[T - Eo] = Ez;
          }));
      let Eq = S["jk"] || 0x0,
        EG = S["bk"] || 0x0,
        Ey = (Eo) => (Eq ? Eo ^ Eq : Eo),
        EP = { parent: I, vars: Object["create"](null) };
      if (k)
        for (let Eo = 0x0; Eo < Math["min"](k["length"], S["p"] || 0x0); Eo++) {
          W[Eo] = k[Eo];
        }
      let El = null,
        EK = ![];
      if (S["nfe"] && S["ni"] !== undefined && N) {
        let Ez = S["c"][S["ni"]];
        EP["vars"][Ez] = N;
        if (!EP["constVars"]) EP["constVars"] = {};
        EP["constVars"][Ez] = !![];
        try {
          Object["defineProperty"](N, "name", {
            value: Ez,
            writable: ![],
            enumerable: ![],
            configurable: !![],
          });
        } catch (EV) {}
      }
      while (a < Z) {
        try {
          while (a < Z) {
            let Ej = a << 0x1,
              Eh = L[Ej] ^ EG,
              Et = Eh,
              EX = E5[Et],
              ED = L[Ej + 0x1],
              EF =
                ED === null ? undefined : typeof ED === "number" ? ED ^ EG : ED;
            if (typeof Ep === "undefined")
              var Ei = ![],
                Ec,
                ER = {
                  0x0: 0x63,
                  0x1: 0x23,
                  0x2: 0x43,
                  0x3: 0x2a,
                  0x4: 0x36,
                  0x5: 0x80,
                  0x6: 0x40,
                  0x7: 0x62,
                  0x8: 0x2d,
                  0x9: 0x77,
                  0xa: 0x68,
                  0xb: 0x4,
                  0xc: 0x69,
                  0xd: 0x55,
                  0xe: 0x37,
                  0xf: 0x19,
                  0x12: 0x27,
                  0x13: 0x1e,
                  0x14: 0x48,
                  0x15: 0x21,
                  0x16: 0x81,
                  0x17: 0x5c,
                  0x18: 0x50,
                  0x19: 0x5,
                  0x1a: 0x2e,
                  0x1b: 0x38,
                  0x20: 0x22,
                  0x28: 0x6c,
                  0x29: 0x15,
                  0x2a: 0x57,
                  0x2b: 0x6,
                  0x2c: 0xd,
                  0x2d: 0x29,
                  0x2e: 0x52,
                  0x2f: 0x1a,
                  0x32: 0x39,
                  0x33: 0x5e,
                  0x34: 0x3b,
                  0x35: 0x13,
                  0x36: 0x1,
                  0x37: 0x60,
                  0x38: 0x4e,
                  0x39: 0x67,
                  0x3a: 0x7e,
                  0x3b: 0x0,
                  0x3c: 0xf,
                  0x3d: 0x7b,
                  0x3e: 0x6f,
                  0x3f: 0x56,
                  0x40: 0x7f,
                  0x46: 0x3f,
                  0x47: 0x59,
                  0x48: 0x5b,
                  0x49: 0x9,
                  0x4a: 0x28,
                  0x4b: 0xc,
                  0x4c: 0x18,
                  0x4d: 0x54,
                  0x4e: 0x88,
                  0x4f: 0x66,
                  0x51: 0x5d,
                  0x52: 0x12,
                  0x5a: 0x49,
                  0x5b: 0x3d,
                  0x5d: 0x7c,
                  0x5e: 0x17,
                  0x64: 0x1c,
                  0x68: 0x8,
                  0x69: 0x3e,
                  0x6a: 0x1f,
                  0x6e: 0x42,
                  0x6f: 0x85,
                  0x70: 0x53,
                  0x7b: 0x2c,
                  0x7c: 0x4f,
                  0x7f: 0x83,
                  0x80: 0x5f,
                  0x81: 0xa,
                  0x82: 0x84,
                  0x83: 0x1d,
                  0x84: 0x10,
                  0x8c: 0x32,
                  0x8d: 0x7,
                  0x8e: 0x72,
                  0x8f: 0x11,
                  0x90: 0x16,
                  0x91: 0x78,
                  0x92: 0x70,
                  0x93: 0x33,
                  0x94: 0x26,
                  0x95: 0x5a,
                  0x96: 0x74,
                  0x97: 0x25,
                  0x98: 0x24,
                  0x99: 0x2b,
                  0x9a: 0x3c,
                  0x9b: 0x61,
                  0x9c: 0x58,
                  0x9d: 0x6e,
                  0x9e: 0xe,
                  0xa0: 0x87,
                  0xa1: 0x4d,
                  0xa2: 0x75,
                  0xa3: 0x64,
                  0xa4: 0x71,
                  0xa7: 0x7d,
                  0xa8: 0x35,
                  0xa9: 0x47,
                  0xaa: 0x2f,
                  0xab: 0x3a,
                  0xac: 0x14,
                  0xad: 0x86,
                  0xae: 0x4a,
                  0xaf: 0x73,
                  0xc8: 0x6b,
                  0xc9: 0x30,
                  0xca: 0x46,
                  0xd2: 0x6a,
                  0xd3: 0x65,
                  0xd4: 0x4c,
                  0xd5: 0x7a,
                  0xd6: 0x79,
                  0xd7: 0x89,
                  0xd8: 0x6d,
                  0xd9: 0x76,
                  0xda: 0x31,
                  0xfa: 0x34,
                  0xfb: 0x1b,
                  0xfc: 0x4b,
                  0xfd: 0xb,
                  0xfe: 0x45,
                  0xff: 0x2,
                  0x100: 0x82,
                  0x101: 0x51,
                  0x102: 0x44,
                  0x103: 0x20,
                  0x104: 0x3,
                  0x105: 0x41,
                },
                Ep = [
                  function (Eg) {
                    while (!![]) {
                      (E0["pop"](), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = K_26978d["_$AuM0V8"];
                      K_26978d["_$AuM0V8"] = undefined;
                      try {
                        let Ex = En["apply"](undefined, z(EE, EY));
                        E9(Ex);
                      } finally {
                        K_26978d["_$AuM0V8"] = Ew;
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10,
                        Ew = W[EY],
                        Ex = J[En];
                      (E9(Ew[Ex]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = W[Eg] + 0x1;
                      ((W[Eg] = EY), E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En - EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En >> EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En !== EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = ![];
                      try {
                        let Ex = Object["create"](EY["prototype"]);
                        EY["apply"](Ex, []);
                      } catch (Ed) {
                        Ed instanceof TypeError &&
                          (Ed["message"]["includes"]("'new'") ||
                            Ed["message"]["includes"]("constructor") ||
                            Ed["message"]["includes"]("Illegal constructor")) &&
                          (Ew = !![]);
                      }
                      if (Ew) {
                        let EH = En,
                          Ev = K_26978d,
                          Es = "_$tDRYIL",
                          EB = "_$xkMAXf",
                          EC = "_$superCalled";
                        try {
                          let ES = new Function(
                            "ParentClass",
                            "vmCtorFunc",
                            "vmGlobals",
                            "ntKey",
                            "ctKey",
                            "scKey",
                            "let RC = class extends ParentClass {" +
                              "  constructor(...args) {" +
                              "    super(...args);" +
                              "    vmGlobals[scKey] = true;" +
                              "    vmGlobals[ctKey] = new.target || RC;" +
                              "    let hadNt = ntKey in vmGlobals;" +
                              "    if (!hadNt) vmGlobals[ntKey] = new.target;" +
                              "    try {" +
                              "      vmCtorFunc.apply(this, args);" +
                              "    } finally {" +
                              "      delete vmGlobals[scKey];" +
                              "      delete vmGlobals[ctKey];" +
                              "      if (!hadNt) delete vmGlobals[ntKey];" +
                              "    }" +
                              "  }" +
                              "};" +
                              "return RC;",
                          )(EY, EH, Ev, Es, EB, EC);
                          (Object["getOwnPropertyNames"](EH)["forEach"](
                            function (Ek) {
                              if (
                                Ek !== "prototype" &&
                                Ek !== "length" &&
                                Ek !== "name"
                              )
                                try {
                                  Object["defineProperty"](
                                    ES,
                                    Ek,
                                    Object["getOwnPropertyDescriptor"](EH, Ek),
                                  );
                                } catch (EI) {}
                            },
                          ),
                            EE(),
                            E9(ES),
                            (ES["_$jzR3JW"] = EY),
                            a++);
                          break;
                        } catch (Ek) {}
                      }
                      (Object["setPrototypeOf"](
                        En["prototype"],
                        EY["prototype"],
                      ),
                        Object["setPrototypeOf"](En, EY),
                        (En["_$jzR3JW"] = EY),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = z(EE, EY),
                        Ew = EE();
                      if (typeof Ew !== "function")
                        throw new TypeError(Ew + " is not a constructor");
                      let Ex = K_26978d["_$AuM0V8"];
                      K_26978d["_$AuM0V8"] = undefined;
                      let Ed;
                      try {
                        Ed = Reflect["construct"](Ew, En);
                      } finally {
                        K_26978d["_$AuM0V8"] = Ex;
                      }
                      (E9(Ed), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = EE();
                      if (Ew === null || Ew === undefined)
                        throw new TypeError(
                          "Cannot set property '" + String(En) + "' of " + Ew,
                        );
                      ((Ew[En] = EY), E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      if (EY == null)
                        throw new TypeError("Cannot iterate over " + EY);
                      let En = EY[Symbol["asyncIterator"]];
                      if (typeof En === "function") E9(En["call"](EY));
                      else {
                        let Ew = EY[Symbol["iterator"]];
                        if (typeof Ew !== "function")
                          throw new TypeError("Object is not async iterable");
                        E9(Ew["call"](EY));
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10;
                      (E9(W[EY] - J[En]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg],
                        En;
                      if (EY in K_26978d) En = K_26978d[EY];
                      else {
                        if (i && EY in i) En = i[EY];
                        else {
                          if (EY in c) En = c[EY];
                          else throw new ReferenceError(EY + " is not defined");
                        }
                      }
                      (E9(En), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En < EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = J[Eg];
                      if (K_26978d["_$5pvLTJ"]) {
                        let Ed = K_26978d["_$5pvLTJ"],
                          EH = Ed["get"](Ew);
                        if (EH && EH["has"](En)) {
                          (EH["set"](En, EY), E9(EY), a++);
                          break;
                        }
                      }
                      let Ex = "_$RqV8iW" + Ew["substring"](0x1) + "_$IzLIfE";
                      if (Ex in En) {
                        ((En[Ex] = EY), E9(EY), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot write private member " +
                          Ew +
                          " to an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      if (Eg >= 0x0) {
                        let En = J[Eg];
                        EP["vars"][En] = EY;
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      (E9(V(EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = EE(),
                        Ex;
                      typeof Ew === "function"
                        ? (Ex = Object["getPrototypeOf"](Ew))
                        : (Ex = Object["getPrototypeOf"](
                            Object["getPrototypeOf"](Ew),
                          ));
                      let Ed = null,
                        EH = Ex;
                      while (EH !== null) {
                        Ed = Object["getOwnPropertyDescriptor"](EH, En);
                        if (Ed) break;
                        EH = Object["getPrototypeOf"](EH);
                      }
                      Ed && Ed["set"]
                        ? Ed["set"]["call"](Ew, EY)
                        : (Ex[En] = EY);
                      (E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      En === null || En === undefined
                        ? E9(undefined)
                        : E9(En[EY]);
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      EY !== null && EY !== undefined ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Em(),
                        Ex =
                          typeof Ew === "function" && Ew["prototype"]
                            ? Ew["prototype"]
                            : Ew;
                      (Object["defineProperty"](Ex, En, {
                        get: EY,
                        enumerable: Ex === Ew,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En != EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = J[Eg];
                      (Object["defineProperty"](En["prototype"], Ew, {
                        value: EY,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em();
                      if (Array["isArray"](EY))
                        Array["prototype"]["push"]["apply"](En, EY);
                      else
                        for (let Ew of EY) {
                          En["push"](Ew);
                        }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg],
                        Ew = !(En in K_26978d) && !(i && En in i) && !(En in c);
                      i && En in i ? (i[En] = EY) : (K_26978d[En] = EY);
                      En in c && (c[En] = EY);
                      Ew && (c[En] = EY);
                      (E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(-EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En >= EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      ((W[Eg] = W[Eg] - 0x1), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = p(EY),
                        Ew = En && En["a"],
                        Ex = En && En["s"],
                        Ed = En && En["g"],
                        EH = EP,
                        Ev = w,
                        Es = x,
                        EB = d,
                        EC =
                          En && En["ni"] !== undefined
                            ? En["c"][En["ni"]]
                            : undefined,
                        ES = (En && En["p"]) || 0x0,
                        Ek = Ew ? O : undefined,
                        EI = (function (
                          EN,
                          EU,
                          EO,
                          Ef,
                          ET,
                          EW,
                          Ea,
                          EJ,
                          EL,
                          Ee,
                          Eu,
                        ) {
                          let Eb, EZ;
                          if (ET)
                            EZ = function () {
                              let m0 = [];
                              for (
                                let m1 = 0x0;
                                m1 < arguments["length"];
                                m1++
                              ) {
                                m0["push"](arguments[m1]);
                              }
                              return EJ["call"](this, EN, m0, EU, Eb);
                            };
                          else
                            Ef
                              ? (EZ = async function () {
                                  let m0 = [];
                                  for (
                                    let m2 = 0x0;
                                    m2 < arguments["length"];
                                    m2++
                                  ) {
                                    m0["push"](arguments[m2]);
                                  }
                                  let m1 =
                                    new.target !== undefined
                                      ? new.target
                                      : K_26978d["_$tDRYIL"];
                                  return EO
                                    ? await Ea["call"](
                                        Ee,
                                        EN,
                                        m0,
                                        EU,
                                        Eb,
                                        undefined,
                                      )
                                    : await Ea["call"](
                                        this,
                                        EN,
                                        m0,
                                        EU,
                                        Eb,
                                        m1,
                                      );
                                })
                              : (EZ = function () {
                                  let m0 = [];
                                  for (
                                    let m2 = 0x0;
                                    m2 < arguments["length"];
                                    m2++
                                  ) {
                                    m0["push"](arguments[m2]);
                                  }
                                  let m1 =
                                    new.target !== undefined
                                      ? new.target
                                      : K_26978d["_$tDRYIL"];
                                  return EO
                                    ? EW["call"](Ee, EN, m0, EU, Eb, undefined)
                                    : EW["call"](this, EN, m0, EU, Eb, m1);
                                });
                          Eb = EZ;
                          if (EL)
                            try {
                              Object["defineProperty"](Eb, "name", {
                                value: EL,
                                writable: ![],
                                enumerable: ![],
                                configurable: !![],
                              });
                            } catch (m0) {}
                          try {
                            Object["defineProperty"](Eb, "length", {
                              value: Eu,
                              writable: ![],
                              enumerable: ![],
                              configurable: !![],
                            });
                          } catch (m1) {}
                          return Eb;
                        })(EY, EH, Ew, Ex, Ed, Ev, Es, EB, EC, Ek, ES);
                      if (!EI)
                        throw new Error("VM Error: Failed to create closure");
                      (E9(EI), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      EY && typeof EY["return"] === "function"
                        ? E9(Promise["resolve"](EY["return"]()))
                        : E9(Promise["resolve"]());
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(+EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      (E9(import(EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      ((W[Eg] = EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En | EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(!EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(undefined), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = J[Eg];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ex = K_26978d["_$5pvLTJ"];
                      !Ex["has"](Ew) && Ex["set"](Ew, new WeakMap());
                      let Ed = Ex["get"](Ew);
                      if (Ed["has"](En))
                        throw new TypeError(
                          "Cannot initialize " +
                            Ew +
                            " twice on the same object",
                        );
                      (Ed["set"](En, EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = J[Eg];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ex = K_26978d["_$5pvLTJ"],
                        Ed = Ex["get"](Ew);
                      if (Ed && Ed["has"](En)) {
                        (Ed["set"](En, EY), E9(EY), a++);
                        break;
                      }
                      let EH = "_$RqV8iW" + Ew["substring"](0x1) + "_$IzLIfE";
                      if (EH in En) {
                        ((En[EH] = EY), E9(EY), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot write private member " +
                          Ew +
                          " to an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = J[Eg];
                      (Object["defineProperty"](En, Ew, {
                        get: EY,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(Math["pow"](En, EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY, En;
                      Eg !== undefined
                        ? ((En = EE()), (EY = J[Eg]))
                        : ((EY = EE()), (En = EE()));
                      let Ew = delete En[EY];
                      (E9(Ew), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En <= EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (EE(), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg],
                        Ew = ![];
                      if (K_26978d["_$5pvLTJ"]) {
                        let Ex = K_26978d["_$5pvLTJ"],
                          Ed = Ex["get"](En);
                        Ew = Ed && Ed["has"](EY);
                      }
                      (E9(Ew), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EY["next"]();
                      (E9(En), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(k[Eg]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En >>> EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Em();
                      (Object["defineProperty"](Ew["prototype"], En, {
                        value: EY,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg];
                      !EP["tdzVars"] && (EP["tdzVars"] = {});
                      ((EP["tdzVars"][EY] = !![]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Eg,
                        Ex = (function (Ed, EH, Ev) {
                          let Es;
                          return (
                            Ev
                              ? (Es = function () {
                                  if (EH) {
                                    K_26978d["_$xkMAXf"] = Es;
                                    let EB = "_$tDRYIL" in K_26978d;
                                    !EB && (K_26978d["_$tDRYIL"] = new.target);
                                    try {
                                      let EC = [];
                                      for (
                                        let ES = 0x0;
                                        ES < arguments["length"];
                                        ES++
                                      ) {
                                        EC["push"](arguments[ES]);
                                      }
                                      return EH["apply"](this, EC);
                                    } finally {
                                      (delete K_26978d["_$xkMAXf"],
                                        !EB && delete K_26978d["_$tDRYIL"]);
                                    }
                                  }
                                })
                              : (Es = function () {
                                  if (EH) {
                                    let EB = "_$tDRYIL" in K_26978d;
                                    !EB && (K_26978d["_$tDRYIL"] = new.target);
                                    try {
                                      let EC = [];
                                      for (
                                        let ES = 0x0;
                                        ES < arguments["length"];
                                        ES++
                                      ) {
                                        EC["push"](arguments[ES]);
                                      }
                                      return EH["apply"](this, EC);
                                    } finally {
                                      !EB && delete K_26978d["_$tDRYIL"];
                                    }
                                  }
                                }),
                            Es
                          );
                        })(EY, En, Ew);
                      EY &&
                        Object["defineProperty"](Ex, "name", {
                          value: EY,
                          configurable: !![],
                        });
                      (E9(Ex), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = J[Eg];
                      (Object["defineProperty"](En, Ew, {
                        value: EY,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      ((W[Eg] = W[Eg] + 0x1), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg];
                      (E9(Symbol["for"](EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      (E9(EY), E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En % EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EQ(0x3),
                        En = EQ(0x2),
                        Ew = Em();
                      (Er(0x3, En), Er(0x2, Ew), EA(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      a = Ey(u[a]);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Em();
                      (Object["defineProperty"](Ew, En, {
                        value: EY,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      !EE() ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = J[Eg],
                        Ex = null;
                      if (K_26978d["_$5pvLTJ"]) {
                        let Ev = K_26978d["_$5pvLTJ"],
                          Es = Ev["get"](Ew);
                        Es && Es["has"](En) && (Ex = Es["get"](En));
                      }
                      if (Ex === null) {
                        let EB = "_$nTfn1c" + Ew["substring"](0x1) + "_$aMjXfo";
                        EB in En && (Ex = En[EB]);
                      }
                      if (Ex === null)
                        throw new TypeError(
                          "Cannot read private member " +
                            Ew +
                            " from an object whose class did not declare it",
                        );
                      if (typeof Ex !== "function")
                        throw new TypeError(Ew + " is not a function");
                      let Ed = [];
                      for (let EC = 0x0; EC < EY; EC++) {
                        Ed["unshift"](EE());
                      }
                      let EH = Ex["apply"](En, Ed);
                      (E9(EH), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em();
                      (En["push"](EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = z(EE, EY),
                        Ew = EE();
                      if (Eg === 0x1) {
                        (E9(En), a++);
                        break;
                      }
                      if (K_26978d["_$superCalled"]) {
                        a++;
                        break;
                      }
                      if (typeof Ew !== "function")
                        throw new TypeError(
                          "Super expression must be a constructor",
                        );
                      K_26978d["_$tDRYIL"] = U;
                      try {
                        let Ex = Ew["apply"](O, En);
                        Ex !== undefined &&
                          Ex !== O &&
                          typeof Ex === "object" &&
                          (O && Object["assign"](Ex, O), (O = Ex), (EK = !![]));
                      } catch (Ed) {
                        if (
                          Ed instanceof TypeError &&
                          (Ed["message"]["includes"]("'new'") ||
                            Ed["message"]["includes"]("constructor"))
                        ) {
                          let EH = Reflect["construct"](Ew, En, U);
                          (EH !== O && O && Object["assign"](EH, O),
                            (O = EH),
                            (EK = !![]));
                        } else throw Ed;
                      } finally {
                        delete K_26978d["_$tDRYIL"];
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg];
                      if (EY === null || EY === undefined)
                        throw new TypeError(
                          "Cannot read property '" + String(En) + "' of " + EY,
                        );
                      (E9(EY[En]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(W[Eg]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = W[Eg] - 0x1;
                      ((W[Eg] = EY), E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(typeof EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(null), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10,
                        Ew = EE(),
                        Ex = z(EE, Ew),
                        Ed = W[EY],
                        EH = J[En],
                        Ev = Ed[EH];
                      (E9(Ev["apply"](Ed, Ex)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10;
                      (E9(W[EY] * J[En]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      ((Ei = !![]),
                        (Ec = f["length"] > 0x0 ? EE() : undefined));
                      return;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      (E9(Symbol["keyFor"](EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En & EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9([]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Em();
                      (Object["defineProperty"](Ew, En, {
                        get: EY,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10;
                      (E9(W[EY] + J[En]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg],
                        En = EE(),
                        Ew = EP,
                        Ex = ![];
                      while (Ew) {
                        if (EY in Ew["vars"]) {
                          if (Ew["constVars"] && EY in Ew["constVars"])
                            throw new TypeError(
                              "Assignment to constant variable.",
                            );
                          Ew["tdzVars"] &&
                            EY in Ew["tdzVars"] &&
                            delete Ew["tdzVars"][EY];
                          ((Ew["vars"][EY] = En), (Ex = !![]));
                          break;
                        }
                        Ew = Ew["parent"];
                      }
                      if (!Ex) {
                        if (EY in K_26978d) K_26978d[EY] = En;
                        else {
                          if (i && EY in i) i[EY] = En;
                          else EY in c ? (c[EY] = En) : (c[EY] = En);
                        }
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (El === null) {
                        let EY = k ? k["length"] : 0x0,
                          En = {};
                        El = new Proxy([], {
                          get: function (Ew, Ex, Ed) {
                            if (Ex === "length") return EY;
                            if (Ex === "callee") return N;
                            if (Ex === Symbol["iterator"])
                              return function () {
                                let Ev = 0x0,
                                  Es = EY;
                                return {
                                  next: function () {
                                    if (Ev < Es) {
                                      let EB =
                                        Ev < k["length"] ? k[Ev] : En[Ev];
                                      return (Ev++, { value: EB, done: ![] });
                                    }
                                    return { done: !![] };
                                  },
                                };
                              };
                            if (typeof Ex === "string") {
                              let Ev = parseInt(Ex, 0xa);
                              if (!isNaN(Ev) && Ev >= 0x0) {
                                if (Ev < k["length"]) return k[Ev];
                                return En[Ev];
                              }
                            }
                            let EH = Array["prototype"][Ex];
                            if (typeof EH === "function")
                              return function () {
                                let Es = [];
                                for (let EB = 0x0; EB < EY; EB++) {
                                  Es[EB] = EB < k["length"] ? k[EB] : En[EB];
                                }
                                return EH["apply"](Es, arguments);
                              };
                            return undefined;
                          },
                          set: function (Ew, Ex, Ed) {
                            if (Ex === "length") return ((EY = Ed), !![]);
                            if (typeof Ex === "string") {
                              let EH = parseInt(Ex, 0xa);
                              if (!isNaN(EH) && EH >= 0x0) {
                                EH < k["length"] ? (k[EH] = Ed) : (En[EH] = Ed);
                                if (EH >= EY) EY = EH + 0x1;
                                return !![];
                              }
                            }
                            return !![];
                          },
                          has: function (Ew, Ex) {
                            if (Ex === "length" || Ex === "callee") return !![];
                            if (typeof Ex === "string") {
                              let Ed = parseInt(Ex, 0xa);
                              if (!isNaN(Ed) && Ed >= 0x0 && Ed < EY)
                                return !![];
                            }
                            return Ex in Array["prototype"];
                          },
                        });
                      }
                      (E9(El), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EY = E0[E0["length"] - 0x1];
                        if (EY["finallyIndex"] !== undefined) {
                          ((E2["hasReturn"] = !![]),
                            (E2["value"] = EE()),
                            (a = EY["finallyIndex"]));
                          break;
                        }
                      }
                      E2["hasReturn"] &&
                        ((E2["hasReturn"] = ![]), (E2["value"] = undefined));
                      ((Ei = !![]), (Ec = EE()));
                      return;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      EY &&
                        typeof EY["return"] === "function" &&
                        EY["return"]();
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En << EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10;
                      W[EY] < J[En] ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En > EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg];
                      if (EY in K_26978d) E9(typeof K_26978d[EY]);
                      else i && EY in i ? E9(typeof i[EY]) : E9(typeof c[EY]);
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9({}), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En / EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EY = E0[E0["length"] - 0x1];
                        if (EY["finallyIndex"] !== undefined) {
                          ((E3["hasBreak"] = !![]),
                            (E3["target"] = Ey(u[a])),
                            (a = EY["finallyIndex"]));
                          break;
                        }
                      }
                      a = Ey(u[a]);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En === EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      EE();
                      let En = Em(),
                        Ew = J[Eg];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ex = K_26978d["_$5pvLTJ"];
                      !Ex["has"](Ew) && Ex["set"](Ew, new WeakMap());
                      let Ed = Ex["get"](Ew);
                      (Ed["set"](En, EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = J[Eg];
                      if (En === null || En === undefined)
                        throw new TypeError(
                          "Cannot set property '" + String(Ew) + "' of " + En,
                        );
                      ((En[Ew] = EY), E9(EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = J[Eg];
                      (Object["defineProperty"](En, Ew, {
                        set: EY,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      if (En === null || En === undefined)
                        throw new TypeError(
                          "Cannot read property '" + String(EY) + "' of " + En,
                        );
                      (E9(En[EY]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(~EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em();
                      EY !== null &&
                        EY !== undefined &&
                        Object["assign"](En, EY);
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      EE() ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      (E9(!!EY["done"]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = EE();
                      if (typeof En !== "function")
                        throw new TypeError(En + " is not a function");
                      let Ex = K_26978d["_$R1bBr6"],
                        Ed = Ex && Ex["get"](En),
                        EH = K_26978d["_$AuM0V8"];
                      Ed &&
                        ((K_26978d["_$CU4Rja"] = !![]),
                        (K_26978d["_$AuM0V8"] = Ed));
                      try {
                        let Ev = En["apply"](Ew, z(EE, EY));
                        E9(Ev);
                      } finally {
                        Ed &&
                          ((K_26978d["_$CU4Rja"] = ![]),
                          (K_26978d["_$AuM0V8"] = EH));
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg];
                      if (EY == null) {
                        (E9(undefined), a++);
                        break;
                      }
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ew = K_26978d["_$5pvLTJ"],
                        Ex = Ew["get"](En);
                      if (!Ex || !Ex["has"](EY))
                        throw new TypeError(
                          "Cannot read private member " +
                            En +
                            " from an object whose class did not declare it",
                        );
                      (E9(Ex["get"](EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      ((W[Eg] = EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(J[Eg]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (EE(), E9(undefined), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg],
                        En = EP,
                        Ew,
                        Ex = ![];
                      while (En) {
                        if (En["tdzVars"] && EY in En["tdzVars"])
                          throw new ReferenceError(
                            "Cannot access '" + EY + "' before initialization",
                          );
                        if (EY in En["vars"]) {
                          ((Ew = En["vars"][EY]), (Ex = !![]));
                          break;
                        }
                        En = En["parent"];
                      }
                      EY === "__this__" && ((Ew = O), (Ex = !![]));
                      if (!Ex) {
                        if (EY in K_26978d) Ew = K_26978d[EY];
                        else i && EY in i ? (Ew = i[EY]) : (Ew = c[EY]);
                      }
                      (E9(Ew), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En in EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      throw EE();
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En + EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En * EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = {
                          vars: Object["create"](null),
                          constVars: Object["create"](null),
                          tdzVars: Object["create"](null),
                          parent: EY,
                        };
                      ((EP = En), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      debugger;
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En == EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg],
                        En = EE(),
                        Ew = EP,
                        Ex = ![];
                      while (Ew) {
                        if (EY in Ew["vars"]) {
                          if (Ew["constVars"] && EY in Ew["constVars"]) break;
                          Ew["vars"][EY] = En;
                          !Ew["constVars"] && (Ew["constVars"] = {});
                          ((Ew["constVars"][EY] = !![]), (Ex = !![]));
                          break;
                        }
                        Ew = Ew["parent"];
                      }
                      !Ex &&
                        (EP["tdzVars"] &&
                          EY in EP["tdzVars"] &&
                          delete EP["tdzVars"][EY],
                        (EP["vars"][EY] = En),
                        !EP["constVars"] && (EP["constVars"] = {}),
                        (EP["constVars"][EY] = !![]));
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg];
                      if (K_26978d["_$5pvLTJ"]) {
                        let Ex = K_26978d["_$5pvLTJ"],
                          Ed = Ex["get"](En);
                        if (Ed && Ed["has"](EY)) {
                          (E9(Ed["get"](EY)), a++);
                          break;
                        }
                      }
                      let Ew = "_$RqV8iW" + En["substring"](0x1) + "_$IzLIfE";
                      if (Ew in EY) {
                        (E9(EY[Ew]), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot read private member " +
                          En +
                          " from an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (E2["hasReturn"]) {
                        let EY = E2["value"];
                        ((E2["hasReturn"] = ![]),
                          (E2["value"] = undefined),
                          (Ei = !![]),
                          (Ec = EY));
                        return;
                      }
                      if (E3["hasBreak"]) {
                        let En = E3["target"];
                        ((E3["hasBreak"] = ![]),
                          (E3["target"] = 0x0),
                          (a = En));
                        break;
                      }
                      if (E4["hasContinue"]) {
                        let Ew = E4["target"];
                        ((E4["hasContinue"] = ![]),
                          (E4["target"] = 0x0),
                          (a = Ew));
                        break;
                      }
                      if (E1 !== null) {
                        let Ex = E1;
                        E1 = null;
                        throw Ex;
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = J[Eg],
                        Ex =
                          typeof En === "function" && En["prototype"]
                            ? En["prototype"]
                            : En;
                      (Object["defineProperty"](Ex, Ew, {
                        set: EY,
                        enumerable: Ex === En,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(U), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = K_26978d["_$AuM0V8"],
                        Ex;
                      if (Ew) Ex = Object["getPrototypeOf"](Ew);
                      else
                        typeof En === "function"
                          ? (Ex = Object["getPrototypeOf"](En))
                          : (Ex = Object["getPrototypeOf"](
                              Object["getPrototypeOf"](En),
                            ));
                      let Ed = null,
                        EH = Ex;
                      while (EH !== null) {
                        Ed = Object["getOwnPropertyDescriptor"](EH, EY);
                        if (Ed) break;
                        EH = Object["getPrototypeOf"](EH);
                      }
                      let Ev;
                      if (Ed && Ed["get"])
                        ((Ev = Ed["get"]["call"](En)), E9(Ev));
                      else {
                        if (Ed && Ed["set"] && !("value" in Ed)) E9(undefined);
                        else {
                          Ev = EH ? EH[EY] : Ex[EY];
                          if (typeof Ev === "function") {
                            let Es = EH || Ex,
                              EB = Ev["bind"](En),
                              EC =
                                Ev["constructor"] && Ev["constructor"]["name"],
                              ES =
                                EC === "GeneratorFunction" ||
                                EC === "AsyncFunction" ||
                                EC === "AsyncGeneratorFunction";
                            (!ES &&
                              (!K_26978d["_$R1bBr6"] &&
                                (K_26978d["_$R1bBr6"] = new WeakMap()),
                              K_26978d["_$R1bBr6"]["set"](EB, Es)),
                              E9(EB));
                          } else E9(Ev);
                        }
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Em();
                      (Object["defineProperty"](Ew, En, {
                        set: EY,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ew = K_26978d["_$5pvLTJ"],
                        Ex = Ew["get"](En);
                      if (Ex && Ex["has"](EY)) {
                        (E9(Ex["get"](EY)), a++);
                        break;
                      }
                      let Ed = "_$RqV8iW" + En["substring"](0x1) + "_$IzLIfE";
                      if (Ed in EY) {
                        (E9(EY[Ed]), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot read private member " +
                          En +
                          " from an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >> 0x10,
                        Ew = J[EY],
                        Ex = J[En];
                      (E9(new RegExp(Ew, Ex)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg],
                        En = EE();
                      if (EP["tdzVars"]) {
                        EY in EP["tdzVars"] && delete EP["tdzVars"][EY];
                        let Ew = EY["split"]("$$")[0x0];
                        Ew !== EY &&
                          Ew in EP["tdzVars"] &&
                          delete EP["tdzVars"][Ew];
                      }
                      EP["vars"][EY] = En;
                      !EP["constVars"] && (EP["constVars"] = {});
                      ((EP["constVars"][EY] = !![]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      ((k[Eg] = EE()), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = Em(),
                        Ew = J[Eg],
                        Ex =
                          typeof En === "function" && En["prototype"]
                            ? En["prototype"]
                            : En;
                      (Object["defineProperty"](Ex, Ew, {
                        get: EY,
                        enumerable: Ex === En,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      EP && EP["parent"] && (EP = EP["parent"]);
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(EP), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EY = E0[E0["length"] - 0x1];
                        EY["finallyIndex"] === a &&
                          (EY["pendingException"] !== undefined &&
                            (E1 = EY["pendingException"]),
                          E0["pop"]());
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = { value: EY };
                      (o["add"](En), E9(En), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (Eg === -0x1) E9(Symbol());
                      else {
                        let EY = EE();
                        E9(Symbol(EY));
                      }
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = b[a];
                      (E0["push"]({
                        catchIndex: EY[0x0] >= 0x0 ? Ey(EY[0x0]) : undefined,
                        finallyIndex: EY[0x1] >= 0x0 ? Ey(EY[0x1]) : undefined,
                        endIndex: EY[0x2] >= 0x0 ? Ey(EY[0x2]) : undefined,
                        stackSize: f["length"],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EY = E0[E0["length"] - 0x1];
                        if (EY["finallyIndex"] !== undefined) {
                          ((E4["hasContinue"] = !![]),
                            (E4["target"] = Ey(u[a])),
                            (a = EY["finallyIndex"]));
                          break;
                        }
                      }
                      a = Ey(u[a]);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Em();
                      (EA(EQ(0x2)), Er(0x2, EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En ^ EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = Eg & 0xffff,
                        En = Eg >>> 0x10;
                      (E9(W[EY] < J[En]), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE();
                      if (EY == null)
                        throw new TypeError("Cannot iterate over " + EY);
                      let En = EY[Symbol["iterator"]];
                      if (typeof En !== "function")
                        throw new TypeError("Object is not iterable");
                      (E9(En["call"](EY)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EY["next"]();
                      (E9(Promise["resolve"](En)), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE();
                      (E9(En instanceof EY), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = EE(),
                        Ew = Em(),
                        Ex =
                          typeof Ew === "function" && Ew["prototype"]
                            ? Ew["prototype"]
                            : Ew;
                      (Object["defineProperty"](Ex, En, {
                        set: EY,
                        enumerable: Ex === Ew,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      (E9(O), a++);
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = EE(),
                        En = J[Eg];
                      EY === null || EY === undefined
                        ? E9(undefined)
                        : E9(EY[En]);
                      a++;
                      break;
                    }
                  },
                  function (Eg) {
                    while (!![]) {
                      let EY = J[Eg],
                        En = EE();
                      if (EP["tdzVars"]) {
                        EY in EP["tdzVars"] && delete EP["tdzVars"][EY];
                        let Ew = EY["split"]("$$")[0x0];
                        Ew !== EY &&
                          Ew in EP["tdzVars"] &&
                          delete EP["tdzVars"][Ew];
                      }
                      ((EP["vars"][EY] = En), a++);
                      break;
                    }
                  },
                ];
            Ep[ER[Et]](EF);
            if (Ei) return ((Ei = ![]), Ec);
          }
          break;
        } catch (Eg) {
          if (E0["length"] > 0x0) {
            let EY = E0[E0["length"] - 0x1];
            T = EY["stackSize"];
            if (EY["catchIndex"] !== undefined)
              (E9(Eg),
                (a = EY["catchIndex"]),
                (EY["catchIndex"] = undefined),
                EY["finallyIndex"] === undefined && E0["pop"]());
            else
              EY["finallyIndex"] !== undefined
                ? ((a = EY["finallyIndex"]), (EY["pendingException"] = Eg))
                : ((a = EY["endIndex"]), E0["pop"]());
            continue;
          }
          throw Eg;
        }
      }
      return T > 0x0 ? EE() : EK ? O : undefined;
    }
    function* n(S, k, I, N, U, O) {
      let f = [],
        T = 0x0,
        W = new Array((S["p"] || 0x0) + (S["l"] || 0x0)),
        a = 0x0,
        J = S["c"],
        L = S["i"],
        u = S["j"] || {},
        b = S["x"] || {},
        Z = L["length"] >> 0x1,
        E0 = [],
        E1 = null,
        E2 = { hasReturn: ![], value: undefined },
        E3 = { hasBreak: ![], target: 0x0 },
        E4 = { hasContinue: ![], target: 0x0 },
        E5 = S["o"] || M;
      var E6 = 0x0,
        E7 = null;
      let E8 = S["seKey"],
        E9,
        EE,
        Em,
        EA,
        EQ,
        Er;
      if (E8 !== undefined) {
        let EM = (Eo) =>
          typeof Eo === "number" &&
          Number["isFinite"](Eo) &&
          Number["isInteger"](Eo) &&
          Eo >= -0x80000000 &&
          Eo <= 0x7fffffff
            ? (Eo ^ E8) | 0x0
            : Eo;
        ((E9 = (Eo) => {
          f[T++] = EM(Eo);
        }),
          (EE = () => EM(f[--T])),
          (Em = () => EM(f[T - 0x1])),
          (EA = (Eo) => {
            f[T - 0x1] = EM(Eo);
          }),
          (EQ = (Eo) => EM(f[T - Eo])),
          (Er = (Eo, Ez) => {
            f[T - Eo] = EM(Ez);
          }));
      } else
        ((E9 = (Eo) => {
          f[T++] = Eo;
        }),
          (EE = () => f[--T]),
          (Em = () => f[T - 0x1]),
          (EA = (Eo) => {
            f[T - 0x1] = Eo;
          }),
          (EQ = (Eo) => f[T - Eo]),
          (Er = (Eo, Ez) => {
            f[T - Eo] = Ez;
          }));
      let Eq = S["jk"] || 0x0,
        EG = S["bk"] || 0x0,
        Ey = (Eo) => (Eq ? Eo ^ Eq : Eo),
        EP = { parent: I, vars: Object["create"](null) };
      if (k)
        for (let Eo = 0x0; Eo < Math["min"](k["length"], S["p"] || 0x0); Eo++) {
          W[Eo] = k[Eo];
        }
      let El = null,
        EK = ![];
      if (S["nfe"] && S["ni"] !== undefined && N) {
        let Ez = S["c"][S["ni"]];
        EP["vars"][Ez] = N;
        if (!EP["constVars"]) EP["constVars"] = {};
        EP["constVars"][Ez] = !![];
        try {
          Object["defineProperty"](N, "name", {
            value: Ez,
            writable: ![],
            enumerable: ![],
            configurable: !![],
          });
        } catch (EV) {}
      }
      while (a < Z) {
        try {
          while (a < Z) {
            let Ej = a << 0x1,
              Eh = L[Ej] ^ EG,
              Et = Eh,
              EX = E5[Et],
              ED = L[Ej + 0x1],
              EF =
                ED === null ? undefined : typeof ED === "number" ? ED ^ EG : ED;
            if (Et === 0x7a) {
              let Eg = EE(),
                EY = yield { t: 0x1, v: Eg };
              (E9(EY), a++);
              continue;
            }
            if (Et === 0x78) {
              let En = EE(),
                Ew = yield { t: 0x2, v: En };
              if (Ew && typeof Ew === "object" && Ew["t"] === 0x4) {
                let Ex = Ew["v"];
                if (E0["length"] > 0x0) {
                  let Ed = E0[E0["length"] - 0x1];
                  if (Ed["finallyIndex"] !== undefined) {
                    ((E2["hasReturn"] = !![]),
                      (E2["value"] = Ex),
                      (a = Ed["finallyIndex"]));
                    continue;
                  }
                }
                return Ex;
              }
              (E9(Ew), a++);
              continue;
            }
            if (Et === 0x79) {
              let EH = EE(),
                Ev = yield { t: 0x3, v: EH };
              (E9(Ev), a++);
              continue;
            }
            if (typeof Ep === "undefined")
              var Ei = ![],
                Ec,
                ER = {
                  0x0: 0x63,
                  0x1: 0x23,
                  0x2: 0x43,
                  0x3: 0x2a,
                  0x4: 0x36,
                  0x5: 0x80,
                  0x6: 0x40,
                  0x7: 0x62,
                  0x8: 0x2d,
                  0x9: 0x77,
                  0xa: 0x68,
                  0xb: 0x4,
                  0xc: 0x69,
                  0xd: 0x55,
                  0xe: 0x37,
                  0xf: 0x19,
                  0x12: 0x27,
                  0x13: 0x1e,
                  0x14: 0x48,
                  0x15: 0x21,
                  0x16: 0x81,
                  0x17: 0x5c,
                  0x18: 0x50,
                  0x19: 0x5,
                  0x1a: 0x2e,
                  0x1b: 0x38,
                  0x20: 0x22,
                  0x28: 0x6c,
                  0x29: 0x15,
                  0x2a: 0x57,
                  0x2b: 0x6,
                  0x2c: 0xd,
                  0x2d: 0x29,
                  0x2e: 0x52,
                  0x2f: 0x1a,
                  0x32: 0x39,
                  0x33: 0x5e,
                  0x34: 0x3b,
                  0x35: 0x13,
                  0x36: 0x1,
                  0x37: 0x60,
                  0x38: 0x4e,
                  0x39: 0x67,
                  0x3a: 0x7e,
                  0x3b: 0x0,
                  0x3c: 0xf,
                  0x3d: 0x7b,
                  0x3e: 0x6f,
                  0x3f: 0x56,
                  0x40: 0x7f,
                  0x46: 0x3f,
                  0x47: 0x59,
                  0x48: 0x5b,
                  0x49: 0x9,
                  0x4a: 0x28,
                  0x4b: 0xc,
                  0x4c: 0x18,
                  0x4d: 0x54,
                  0x4e: 0x88,
                  0x4f: 0x66,
                  0x51: 0x5d,
                  0x52: 0x12,
                  0x5a: 0x49,
                  0x5b: 0x3d,
                  0x5d: 0x7c,
                  0x5e: 0x17,
                  0x64: 0x1c,
                  0x68: 0x8,
                  0x69: 0x3e,
                  0x6a: 0x1f,
                  0x6e: 0x42,
                  0x6f: 0x85,
                  0x70: 0x53,
                  0x7b: 0x2c,
                  0x7c: 0x4f,
                  0x7f: 0x83,
                  0x80: 0x5f,
                  0x81: 0xa,
                  0x82: 0x84,
                  0x83: 0x1d,
                  0x84: 0x10,
                  0x8c: 0x32,
                  0x8d: 0x7,
                  0x8e: 0x72,
                  0x8f: 0x11,
                  0x90: 0x16,
                  0x91: 0x78,
                  0x92: 0x70,
                  0x93: 0x33,
                  0x94: 0x26,
                  0x95: 0x5a,
                  0x96: 0x74,
                  0x97: 0x25,
                  0x98: 0x24,
                  0x99: 0x2b,
                  0x9a: 0x3c,
                  0x9b: 0x61,
                  0x9c: 0x58,
                  0x9d: 0x6e,
                  0x9e: 0xe,
                  0xa0: 0x87,
                  0xa1: 0x4d,
                  0xa2: 0x75,
                  0xa3: 0x64,
                  0xa4: 0x71,
                  0xa7: 0x7d,
                  0xa8: 0x35,
                  0xa9: 0x47,
                  0xaa: 0x2f,
                  0xab: 0x3a,
                  0xac: 0x14,
                  0xad: 0x86,
                  0xae: 0x4a,
                  0xaf: 0x73,
                  0xc8: 0x6b,
                  0xc9: 0x30,
                  0xca: 0x46,
                  0xd2: 0x6a,
                  0xd3: 0x65,
                  0xd4: 0x4c,
                  0xd5: 0x7a,
                  0xd6: 0x79,
                  0xd7: 0x89,
                  0xd8: 0x6d,
                  0xd9: 0x76,
                  0xda: 0x31,
                  0xfa: 0x34,
                  0xfb: 0x1b,
                  0xfc: 0x4b,
                  0xfd: 0xb,
                  0xfe: 0x45,
                  0xff: 0x2,
                  0x100: 0x82,
                  0x101: 0x51,
                  0x102: 0x44,
                  0x103: 0x20,
                  0x104: 0x3,
                  0x105: 0x41,
                },
                Ep = [
                  function (Es) {
                    while (!![]) {
                      (E0["pop"](), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = K_26978d["_$AuM0V8"];
                      K_26978d["_$AuM0V8"] = undefined;
                      try {
                        let Ek = EC["apply"](undefined, z(EE, EB));
                        E9(Ek);
                      } finally {
                        K_26978d["_$AuM0V8"] = ES;
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10,
                        ES = W[EB],
                        Ek = J[EC];
                      (E9(ES[Ek]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = W[Es] + 0x1;
                      ((W[Es] = EB), E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC - EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC >> EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC !== EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = ![];
                      try {
                        let Ek = Object["create"](EB["prototype"]);
                        EB["apply"](Ek, []);
                      } catch (EI) {
                        EI instanceof TypeError &&
                          (EI["message"]["includes"]("'new'") ||
                            EI["message"]["includes"]("constructor") ||
                            EI["message"]["includes"]("Illegal constructor")) &&
                          (ES = !![]);
                      }
                      if (ES) {
                        let EN = EC,
                          EU = K_26978d,
                          EO = "_$tDRYIL",
                          Ef = "_$xkMAXf",
                          ET = "_$superCalled";
                        try {
                          let EW = new Function(
                            "ParentClass",
                            "vmCtorFunc",
                            "vmGlobals",
                            "ntKey",
                            "ctKey",
                            "scKey",
                            "let RC = class extends ParentClass {" +
                              "  constructor(...args) {" +
                              "    super(...args);" +
                              "    vmGlobals[scKey] = true;" +
                              "    vmGlobals[ctKey] = new.target || RC;" +
                              "    let hadNt = ntKey in vmGlobals;" +
                              "    if (!hadNt) vmGlobals[ntKey] = new.target;" +
                              "    try {" +
                              "      vmCtorFunc.apply(this, args);" +
                              "    } finally {" +
                              "      delete vmGlobals[scKey];" +
                              "      delete vmGlobals[ctKey];" +
                              "      if (!hadNt) delete vmGlobals[ntKey];" +
                              "    }" +
                              "  }" +
                              "};" +
                              "return RC;",
                          )(EB, EN, EU, EO, Ef, ET);
                          (Object["getOwnPropertyNames"](EN)["forEach"](
                            function (Ea) {
                              if (
                                Ea !== "prototype" &&
                                Ea !== "length" &&
                                Ea !== "name"
                              )
                                try {
                                  Object["defineProperty"](
                                    EW,
                                    Ea,
                                    Object["getOwnPropertyDescriptor"](EN, Ea),
                                  );
                                } catch (EJ) {}
                            },
                          ),
                            EE(),
                            E9(EW),
                            (EW["_$jzR3JW"] = EB),
                            a++);
                          break;
                        } catch (Ea) {}
                      }
                      (Object["setPrototypeOf"](
                        EC["prototype"],
                        EB["prototype"],
                      ),
                        Object["setPrototypeOf"](EC, EB),
                        (EC["_$jzR3JW"] = EB),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = z(EE, EB),
                        ES = EE();
                      if (typeof ES !== "function")
                        throw new TypeError(ES + " is not a constructor");
                      let Ek = K_26978d["_$AuM0V8"];
                      K_26978d["_$AuM0V8"] = undefined;
                      let EI;
                      try {
                        EI = Reflect["construct"](ES, EC);
                      } finally {
                        K_26978d["_$AuM0V8"] = Ek;
                      }
                      (E9(EI), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = EE();
                      if (ES === null || ES === undefined)
                        throw new TypeError(
                          "Cannot set property '" + String(EC) + "' of " + ES,
                        );
                      ((ES[EC] = EB), E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      if (EB == null)
                        throw new TypeError("Cannot iterate over " + EB);
                      let EC = EB[Symbol["asyncIterator"]];
                      if (typeof EC === "function") E9(EC["call"](EB));
                      else {
                        let ES = EB[Symbol["iterator"]];
                        if (typeof ES !== "function")
                          throw new TypeError("Object is not async iterable");
                        E9(ES["call"](EB));
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10;
                      (E9(W[EB] - J[EC]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es],
                        EC;
                      if (EB in K_26978d) EC = K_26978d[EB];
                      else {
                        if (i && EB in i) EC = i[EB];
                        else {
                          if (EB in c) EC = c[EB];
                          else throw new ReferenceError(EB + " is not defined");
                        }
                      }
                      (E9(EC), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC < EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = J[Es];
                      if (K_26978d["_$5pvLTJ"]) {
                        let EI = K_26978d["_$5pvLTJ"],
                          EN = EI["get"](ES);
                        if (EN && EN["has"](EC)) {
                          (EN["set"](EC, EB), E9(EB), a++);
                          break;
                        }
                      }
                      let Ek = "_$RqV8iW" + ES["substring"](0x1) + "_$IzLIfE";
                      if (Ek in EC) {
                        ((EC[Ek] = EB), E9(EB), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot write private member " +
                          ES +
                          " to an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      if (Es >= 0x0) {
                        let EC = J[Es];
                        EP["vars"][EC] = EB;
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      (E9(V(EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = EE(),
                        Ek;
                      typeof ES === "function"
                        ? (Ek = Object["getPrototypeOf"](ES))
                        : (Ek = Object["getPrototypeOf"](
                            Object["getPrototypeOf"](ES),
                          ));
                      let EI = null,
                        EN = Ek;
                      while (EN !== null) {
                        EI = Object["getOwnPropertyDescriptor"](EN, EC);
                        if (EI) break;
                        EN = Object["getPrototypeOf"](EN);
                      }
                      EI && EI["set"]
                        ? EI["set"]["call"](ES, EB)
                        : (Ek[EC] = EB);
                      (E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      EC === null || EC === undefined
                        ? E9(undefined)
                        : E9(EC[EB]);
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      EB !== null && EB !== undefined ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Em(),
                        Ek =
                          typeof ES === "function" && ES["prototype"]
                            ? ES["prototype"]
                            : ES;
                      (Object["defineProperty"](Ek, EC, {
                        get: EB,
                        enumerable: Ek === ES,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC != EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = J[Es];
                      (Object["defineProperty"](EC["prototype"], ES, {
                        value: EB,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em();
                      if (Array["isArray"](EB))
                        Array["prototype"]["push"]["apply"](EC, EB);
                      else
                        for (let ES of EB) {
                          EC["push"](ES);
                        }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es],
                        ES = !(EC in K_26978d) && !(i && EC in i) && !(EC in c);
                      i && EC in i ? (i[EC] = EB) : (K_26978d[EC] = EB);
                      EC in c && (c[EC] = EB);
                      ES && (c[EC] = EB);
                      (E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(-EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC >= EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      ((W[Es] = W[Es] - 0x1), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = p(EB),
                        ES = EC && EC["a"],
                        Ek = EC && EC["s"],
                        EI = EC && EC["g"],
                        EN = EP,
                        EU = w,
                        EO = x,
                        Ef = d,
                        ET =
                          EC && EC["ni"] !== undefined
                            ? EC["c"][EC["ni"]]
                            : undefined,
                        EW = (EC && EC["p"]) || 0x0,
                        Ea = ES ? O : undefined,
                        EJ = (function (
                          EL,
                          Ee,
                          Eu,
                          Eb,
                          EZ,
                          m0,
                          m1,
                          m2,
                          m3,
                          m4,
                          m5,
                        ) {
                          let m6, m7;
                          if (EZ)
                            m7 = function () {
                              let m8 = [];
                              for (
                                let m9 = 0x0;
                                m9 < arguments["length"];
                                m9++
                              ) {
                                m8["push"](arguments[m9]);
                              }
                              return m2["call"](this, EL, m8, Ee, m6);
                            };
                          else
                            Eb
                              ? (m7 = async function () {
                                  let m8 = [];
                                  for (
                                    let mE = 0x0;
                                    mE < arguments["length"];
                                    mE++
                                  ) {
                                    m8["push"](arguments[mE]);
                                  }
                                  let m9 =
                                    new.target !== undefined
                                      ? new.target
                                      : K_26978d["_$tDRYIL"];
                                  return Eu
                                    ? await m1["call"](
                                        m4,
                                        EL,
                                        m8,
                                        Ee,
                                        m6,
                                        undefined,
                                      )
                                    : await m1["call"](
                                        this,
                                        EL,
                                        m8,
                                        Ee,
                                        m6,
                                        m9,
                                      );
                                })
                              : (m7 = function () {
                                  let m8 = [];
                                  for (
                                    let mE = 0x0;
                                    mE < arguments["length"];
                                    mE++
                                  ) {
                                    m8["push"](arguments[mE]);
                                  }
                                  let m9 =
                                    new.target !== undefined
                                      ? new.target
                                      : K_26978d["_$tDRYIL"];
                                  return Eu
                                    ? m0["call"](m4, EL, m8, Ee, m6, undefined)
                                    : m0["call"](this, EL, m8, Ee, m6, m9);
                                });
                          m6 = m7;
                          if (m3)
                            try {
                              Object["defineProperty"](m6, "name", {
                                value: m3,
                                writable: ![],
                                enumerable: ![],
                                configurable: !![],
                              });
                            } catch (m8) {}
                          try {
                            Object["defineProperty"](m6, "length", {
                              value: m5,
                              writable: ![],
                              enumerable: ![],
                              configurable: !![],
                            });
                          } catch (m9) {}
                          return m6;
                        })(EB, EN, ES, Ek, EI, EU, EO, Ef, ET, Ea, EW);
                      if (!EJ)
                        throw new Error("VM Error: Failed to create closure");
                      (E9(EJ), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      EB && typeof EB["return"] === "function"
                        ? E9(Promise["resolve"](EB["return"]()))
                        : E9(Promise["resolve"]());
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(+EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      (E9(import(EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      ((W[Es] = EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC | EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(!EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(undefined), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = J[Es];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ek = K_26978d["_$5pvLTJ"];
                      !Ek["has"](ES) && Ek["set"](ES, new WeakMap());
                      let EI = Ek["get"](ES);
                      if (EI["has"](EC))
                        throw new TypeError(
                          "Cannot initialize " +
                            ES +
                            " twice on the same object",
                        );
                      (EI["set"](EC, EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = J[Es];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ek = K_26978d["_$5pvLTJ"],
                        EI = Ek["get"](ES);
                      if (EI && EI["has"](EC)) {
                        (EI["set"](EC, EB), E9(EB), a++);
                        break;
                      }
                      let EN = "_$RqV8iW" + ES["substring"](0x1) + "_$IzLIfE";
                      if (EN in EC) {
                        ((EC[EN] = EB), E9(EB), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot write private member " +
                          ES +
                          " to an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = J[Es];
                      (Object["defineProperty"](EC, ES, {
                        get: EB,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(Math["pow"](EC, EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB, EC;
                      Es !== undefined
                        ? ((EC = EE()), (EB = J[Es]))
                        : ((EB = EE()), (EC = EE()));
                      let ES = delete EC[EB];
                      (E9(ES), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC <= EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (EE(), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es],
                        ES = ![];
                      if (K_26978d["_$5pvLTJ"]) {
                        let Ek = K_26978d["_$5pvLTJ"],
                          EI = Ek["get"](EC);
                        ES = EI && EI["has"](EB);
                      }
                      (E9(ES), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EB["next"]();
                      (E9(EC), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(k[Es]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC >>> EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Em();
                      (Object["defineProperty"](ES["prototype"], EC, {
                        value: EB,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es];
                      !EP["tdzVars"] && (EP["tdzVars"] = {});
                      ((EP["tdzVars"][EB] = !![]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Es,
                        Ek = (function (EI, EN, EU) {
                          let EO;
                          return (
                            EU
                              ? (EO = function () {
                                  if (EN) {
                                    K_26978d["_$xkMAXf"] = EO;
                                    let Ef = "_$tDRYIL" in K_26978d;
                                    !Ef && (K_26978d["_$tDRYIL"] = new.target);
                                    try {
                                      let ET = [];
                                      for (
                                        let EW = 0x0;
                                        EW < arguments["length"];
                                        EW++
                                      ) {
                                        ET["push"](arguments[EW]);
                                      }
                                      return EN["apply"](this, ET);
                                    } finally {
                                      (delete K_26978d["_$xkMAXf"],
                                        !Ef && delete K_26978d["_$tDRYIL"]);
                                    }
                                  }
                                })
                              : (EO = function () {
                                  if (EN) {
                                    let Ef = "_$tDRYIL" in K_26978d;
                                    !Ef && (K_26978d["_$tDRYIL"] = new.target);
                                    try {
                                      let ET = [];
                                      for (
                                        let EW = 0x0;
                                        EW < arguments["length"];
                                        EW++
                                      ) {
                                        ET["push"](arguments[EW]);
                                      }
                                      return EN["apply"](this, ET);
                                    } finally {
                                      !Ef && delete K_26978d["_$tDRYIL"];
                                    }
                                  }
                                }),
                            EO
                          );
                        })(EB, EC, ES);
                      EB &&
                        Object["defineProperty"](Ek, "name", {
                          value: EB,
                          configurable: !![],
                        });
                      (E9(Ek), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = J[Es];
                      (Object["defineProperty"](EC, ES, {
                        value: EB,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      ((W[Es] = W[Es] + 0x1), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es];
                      (E9(Symbol["for"](EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      (E9(EB), E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC % EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EQ(0x3),
                        EC = EQ(0x2),
                        ES = Em();
                      (Er(0x3, EC), Er(0x2, ES), EA(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      a = Ey(u[a]);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Em();
                      (Object["defineProperty"](ES, EC, {
                        value: EB,
                        writable: !![],
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      !EE() ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = J[Es],
                        Ek = null;
                      if (K_26978d["_$5pvLTJ"]) {
                        let EU = K_26978d["_$5pvLTJ"],
                          EO = EU["get"](ES);
                        EO && EO["has"](EC) && (Ek = EO["get"](EC));
                      }
                      if (Ek === null) {
                        let Ef = "_$nTfn1c" + ES["substring"](0x1) + "_$aMjXfo";
                        Ef in EC && (Ek = EC[Ef]);
                      }
                      if (Ek === null)
                        throw new TypeError(
                          "Cannot read private member " +
                            ES +
                            " from an object whose class did not declare it",
                        );
                      if (typeof Ek !== "function")
                        throw new TypeError(ES + " is not a function");
                      let EI = [];
                      for (let ET = 0x0; ET < EB; ET++) {
                        EI["unshift"](EE());
                      }
                      let EN = Ek["apply"](EC, EI);
                      (E9(EN), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em();
                      (EC["push"](EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = z(EE, EB),
                        ES = EE();
                      if (Es === 0x1) {
                        (E9(EC), a++);
                        break;
                      }
                      if (K_26978d["_$superCalled"]) {
                        a++;
                        break;
                      }
                      if (typeof ES !== "function")
                        throw new TypeError(
                          "Super expression must be a constructor",
                        );
                      K_26978d["_$tDRYIL"] = U;
                      try {
                        let Ek = ES["apply"](O, EC);
                        Ek !== undefined &&
                          Ek !== O &&
                          typeof Ek === "object" &&
                          (O && Object["assign"](Ek, O), (O = Ek), (EK = !![]));
                      } catch (EI) {
                        if (
                          EI instanceof TypeError &&
                          (EI["message"]["includes"]("'new'") ||
                            EI["message"]["includes"]("constructor"))
                        ) {
                          let EN = Reflect["construct"](ES, EC, U);
                          (EN !== O && O && Object["assign"](EN, O),
                            (O = EN),
                            (EK = !![]));
                        } else throw EI;
                      } finally {
                        delete K_26978d["_$tDRYIL"];
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es];
                      if (EB === null || EB === undefined)
                        throw new TypeError(
                          "Cannot read property '" + String(EC) + "' of " + EB,
                        );
                      (E9(EB[EC]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(W[Es]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = W[Es] - 0x1;
                      ((W[Es] = EB), E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(typeof EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(null), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10,
                        ES = EE(),
                        Ek = z(EE, ES),
                        EI = W[EB],
                        EN = J[EC],
                        EU = EI[EN];
                      (E9(EU["apply"](EI, Ek)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10;
                      (E9(W[EB] * J[EC]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      ((Ei = !![]),
                        (Ec = f["length"] > 0x0 ? EE() : undefined));
                      return;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      (E9(Symbol["keyFor"](EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC & EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9([]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Em();
                      (Object["defineProperty"](ES, EC, {
                        get: EB,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10;
                      (E9(W[EB] + J[EC]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es],
                        EC = EE(),
                        ES = EP,
                        Ek = ![];
                      while (ES) {
                        if (EB in ES["vars"]) {
                          if (ES["constVars"] && EB in ES["constVars"])
                            throw new TypeError(
                              "Assignment to constant variable.",
                            );
                          ES["tdzVars"] &&
                            EB in ES["tdzVars"] &&
                            delete ES["tdzVars"][EB];
                          ((ES["vars"][EB] = EC), (Ek = !![]));
                          break;
                        }
                        ES = ES["parent"];
                      }
                      if (!Ek) {
                        if (EB in K_26978d) K_26978d[EB] = EC;
                        else {
                          if (i && EB in i) i[EB] = EC;
                          else EB in c ? (c[EB] = EC) : (c[EB] = EC);
                        }
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (El === null) {
                        let EB = k ? k["length"] : 0x0,
                          EC = {};
                        El = new Proxy([], {
                          get: function (ES, Ek, EI) {
                            if (Ek === "length") return EB;
                            if (Ek === "callee") return N;
                            if (Ek === Symbol["iterator"])
                              return function () {
                                let EU = 0x0,
                                  EO = EB;
                                return {
                                  next: function () {
                                    if (EU < EO) {
                                      let Ef =
                                        EU < k["length"] ? k[EU] : EC[EU];
                                      return (EU++, { value: Ef, done: ![] });
                                    }
                                    return { done: !![] };
                                  },
                                };
                              };
                            if (typeof Ek === "string") {
                              let EU = parseInt(Ek, 0xa);
                              if (!isNaN(EU) && EU >= 0x0) {
                                if (EU < k["length"]) return k[EU];
                                return EC[EU];
                              }
                            }
                            let EN = Array["prototype"][Ek];
                            if (typeof EN === "function")
                              return function () {
                                let EO = [];
                                for (let Ef = 0x0; Ef < EB; Ef++) {
                                  EO[Ef] = Ef < k["length"] ? k[Ef] : EC[Ef];
                                }
                                return EN["apply"](EO, arguments);
                              };
                            return undefined;
                          },
                          set: function (ES, Ek, EI) {
                            if (Ek === "length") return ((EB = EI), !![]);
                            if (typeof Ek === "string") {
                              let EN = parseInt(Ek, 0xa);
                              if (!isNaN(EN) && EN >= 0x0) {
                                EN < k["length"] ? (k[EN] = EI) : (EC[EN] = EI);
                                if (EN >= EB) EB = EN + 0x1;
                                return !![];
                              }
                            }
                            return !![];
                          },
                          has: function (ES, Ek) {
                            if (Ek === "length" || Ek === "callee") return !![];
                            if (typeof Ek === "string") {
                              let EI = parseInt(Ek, 0xa);
                              if (!isNaN(EI) && EI >= 0x0 && EI < EB)
                                return !![];
                            }
                            return Ek in Array["prototype"];
                          },
                        });
                      }
                      (E9(El), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EB = E0[E0["length"] - 0x1];
                        if (EB["finallyIndex"] !== undefined) {
                          ((E2["hasReturn"] = !![]),
                            (E2["value"] = EE()),
                            (a = EB["finallyIndex"]));
                          break;
                        }
                      }
                      E2["hasReturn"] &&
                        ((E2["hasReturn"] = ![]), (E2["value"] = undefined));
                      ((Ei = !![]), (Ec = EE()));
                      return;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      EB &&
                        typeof EB["return"] === "function" &&
                        EB["return"]();
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC << EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10;
                      W[EB] < J[EC] ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC > EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es];
                      if (EB in K_26978d) E9(typeof K_26978d[EB]);
                      else i && EB in i ? E9(typeof i[EB]) : E9(typeof c[EB]);
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9({}), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC / EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EB = E0[E0["length"] - 0x1];
                        if (EB["finallyIndex"] !== undefined) {
                          ((E3["hasBreak"] = !![]),
                            (E3["target"] = Ey(u[a])),
                            (a = EB["finallyIndex"]));
                          break;
                        }
                      }
                      a = Ey(u[a]);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC === EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      EE();
                      let EC = Em(),
                        ES = J[Es];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let Ek = K_26978d["_$5pvLTJ"];
                      !Ek["has"](ES) && Ek["set"](ES, new WeakMap());
                      let EI = Ek["get"](ES);
                      (EI["set"](EC, EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = J[Es];
                      if (EC === null || EC === undefined)
                        throw new TypeError(
                          "Cannot set property '" + String(ES) + "' of " + EC,
                        );
                      ((EC[ES] = EB), E9(EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = J[Es];
                      (Object["defineProperty"](EC, ES, {
                        set: EB,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      if (EC === null || EC === undefined)
                        throw new TypeError(
                          "Cannot read property '" + String(EB) + "' of " + EC,
                        );
                      (E9(EC[EB]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(~EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em();
                      EB !== null &&
                        EB !== undefined &&
                        Object["assign"](EC, EB);
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      EE() ? (a = Ey(u[a])) : a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      (E9(!!EB["done"]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = EE();
                      if (typeof EC !== "function")
                        throw new TypeError(EC + " is not a function");
                      let Ek = K_26978d["_$R1bBr6"],
                        EI = Ek && Ek["get"](EC),
                        EN = K_26978d["_$AuM0V8"];
                      EI &&
                        ((K_26978d["_$CU4Rja"] = !![]),
                        (K_26978d["_$AuM0V8"] = EI));
                      try {
                        let EU = EC["apply"](ES, z(EE, EB));
                        E9(EU);
                      } finally {
                        EI &&
                          ((K_26978d["_$CU4Rja"] = ![]),
                          (K_26978d["_$AuM0V8"] = EN));
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es];
                      if (EB == null) {
                        (E9(undefined), a++);
                        break;
                      }
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let ES = K_26978d["_$5pvLTJ"],
                        Ek = ES["get"](EC);
                      if (!Ek || !Ek["has"](EB))
                        throw new TypeError(
                          "Cannot read private member " +
                            EC +
                            " from an object whose class did not declare it",
                        );
                      (E9(Ek["get"](EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      ((W[Es] = EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(J[Es]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (EE(), E9(undefined), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es],
                        EC = EP,
                        ES,
                        Ek = ![];
                      while (EC) {
                        if (EC["tdzVars"] && EB in EC["tdzVars"])
                          throw new ReferenceError(
                            "Cannot access '" + EB + "' before initialization",
                          );
                        if (EB in EC["vars"]) {
                          ((ES = EC["vars"][EB]), (Ek = !![]));
                          break;
                        }
                        EC = EC["parent"];
                      }
                      EB === "__this__" && ((ES = O), (Ek = !![]));
                      if (!Ek) {
                        if (EB in K_26978d) ES = K_26978d[EB];
                        else i && EB in i ? (ES = i[EB]) : (ES = c[EB]);
                      }
                      (E9(ES), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC in EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      throw EE();
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC + EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC * EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = {
                          vars: Object["create"](null),
                          constVars: Object["create"](null),
                          tdzVars: Object["create"](null),
                          parent: EB,
                        };
                      ((EP = EC), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      debugger;
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC == EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es],
                        EC = EE(),
                        ES = EP,
                        Ek = ![];
                      while (ES) {
                        if (EB in ES["vars"]) {
                          if (ES["constVars"] && EB in ES["constVars"]) break;
                          ES["vars"][EB] = EC;
                          !ES["constVars"] && (ES["constVars"] = {});
                          ((ES["constVars"][EB] = !![]), (Ek = !![]));
                          break;
                        }
                        ES = ES["parent"];
                      }
                      !Ek &&
                        (EP["tdzVars"] &&
                          EB in EP["tdzVars"] &&
                          delete EP["tdzVars"][EB],
                        (EP["vars"][EB] = EC),
                        !EP["constVars"] && (EP["constVars"] = {}),
                        (EP["constVars"][EB] = !![]));
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es];
                      if (K_26978d["_$5pvLTJ"]) {
                        let Ek = K_26978d["_$5pvLTJ"],
                          EI = Ek["get"](EC);
                        if (EI && EI["has"](EB)) {
                          (E9(EI["get"](EB)), a++);
                          break;
                        }
                      }
                      let ES = "_$RqV8iW" + EC["substring"](0x1) + "_$IzLIfE";
                      if (ES in EB) {
                        (E9(EB[ES]), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot read private member " +
                          EC +
                          " from an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (E2["hasReturn"]) {
                        let EB = E2["value"];
                        ((E2["hasReturn"] = ![]),
                          (E2["value"] = undefined),
                          (Ei = !![]),
                          (Ec = EB));
                        return;
                      }
                      if (E3["hasBreak"]) {
                        let EC = E3["target"];
                        ((E3["hasBreak"] = ![]),
                          (E3["target"] = 0x0),
                          (a = EC));
                        break;
                      }
                      if (E4["hasContinue"]) {
                        let ES = E4["target"];
                        ((E4["hasContinue"] = ![]),
                          (E4["target"] = 0x0),
                          (a = ES));
                        break;
                      }
                      if (E1 !== null) {
                        let Ek = E1;
                        E1 = null;
                        throw Ek;
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = J[Es],
                        Ek =
                          typeof EC === "function" && EC["prototype"]
                            ? EC["prototype"]
                            : EC;
                      (Object["defineProperty"](Ek, ES, {
                        set: EB,
                        enumerable: Ek === EC,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(U), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = K_26978d["_$AuM0V8"],
                        Ek;
                      if (ES) Ek = Object["getPrototypeOf"](ES);
                      else
                        typeof EC === "function"
                          ? (Ek = Object["getPrototypeOf"](EC))
                          : (Ek = Object["getPrototypeOf"](
                              Object["getPrototypeOf"](EC),
                            ));
                      let EI = null,
                        EN = Ek;
                      while (EN !== null) {
                        EI = Object["getOwnPropertyDescriptor"](EN, EB);
                        if (EI) break;
                        EN = Object["getPrototypeOf"](EN);
                      }
                      let EU;
                      if (EI && EI["get"])
                        ((EU = EI["get"]["call"](EC)), E9(EU));
                      else {
                        if (EI && EI["set"] && !("value" in EI)) E9(undefined);
                        else {
                          EU = EN ? EN[EB] : Ek[EB];
                          if (typeof EU === "function") {
                            let EO = EN || Ek,
                              Ef = EU["bind"](EC),
                              ET =
                                EU["constructor"] && EU["constructor"]["name"],
                              EW =
                                ET === "GeneratorFunction" ||
                                ET === "AsyncFunction" ||
                                ET === "AsyncGeneratorFunction";
                            (!EW &&
                              (!K_26978d["_$R1bBr6"] &&
                                (K_26978d["_$R1bBr6"] = new WeakMap()),
                              K_26978d["_$R1bBr6"]["set"](Ef, EO)),
                              E9(Ef));
                          } else E9(EU);
                        }
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Em();
                      (Object["defineProperty"](ES, EC, {
                        set: EB,
                        enumerable: ![],
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es];
                      !K_26978d["_$5pvLTJ"] &&
                        (K_26978d["_$5pvLTJ"] = new Map());
                      let ES = K_26978d["_$5pvLTJ"],
                        Ek = ES["get"](EC);
                      if (Ek && Ek["has"](EB)) {
                        (E9(Ek["get"](EB)), a++);
                        break;
                      }
                      let EI = "_$RqV8iW" + EC["substring"](0x1) + "_$IzLIfE";
                      if (EI in EB) {
                        (E9(EB[EI]), a++);
                        break;
                      }
                      throw new TypeError(
                        "Cannot read private member " +
                          EC +
                          " from an object whose class did not declare it",
                      );
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >> 0x10,
                        ES = J[EB],
                        Ek = J[EC];
                      (E9(new RegExp(ES, Ek)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es],
                        EC = EE();
                      if (EP["tdzVars"]) {
                        EB in EP["tdzVars"] && delete EP["tdzVars"][EB];
                        let ES = EB["split"]("$$")[0x0];
                        ES !== EB &&
                          ES in EP["tdzVars"] &&
                          delete EP["tdzVars"][ES];
                      }
                      EP["vars"][EB] = EC;
                      !EP["constVars"] && (EP["constVars"] = {});
                      ((EP["constVars"][EB] = !![]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      ((k[Es] = EE()), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = Em(),
                        ES = J[Es],
                        Ek =
                          typeof EC === "function" && EC["prototype"]
                            ? EC["prototype"]
                            : EC;
                      (Object["defineProperty"](Ek, ES, {
                        get: EB,
                        enumerable: Ek === EC,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      EP && EP["parent"] && (EP = EP["parent"]);
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(EP), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EB = E0[E0["length"] - 0x1];
                        EB["finallyIndex"] === a &&
                          (EB["pendingException"] !== undefined &&
                            (E1 = EB["pendingException"]),
                          E0["pop"]());
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = { value: EB };
                      (o["add"](EC), E9(EC), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (Es === -0x1) E9(Symbol());
                      else {
                        let EB = EE();
                        E9(Symbol(EB));
                      }
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = b[a];
                      (E0["push"]({
                        catchIndex: EB[0x0] >= 0x0 ? Ey(EB[0x0]) : undefined,
                        finallyIndex: EB[0x1] >= 0x0 ? Ey(EB[0x1]) : undefined,
                        endIndex: EB[0x2] >= 0x0 ? Ey(EB[0x2]) : undefined,
                        stackSize: f["length"],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      if (E0["length"] > 0x0) {
                        let EB = E0[E0["length"] - 0x1];
                        if (EB["finallyIndex"] !== undefined) {
                          ((E4["hasContinue"] = !![]),
                            (E4["target"] = Ey(u[a])),
                            (a = EB["finallyIndex"]));
                          break;
                        }
                      }
                      a = Ey(u[a]);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Em();
                      (EA(EQ(0x2)), Er(0x2, EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC ^ EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = Es & 0xffff,
                        EC = Es >>> 0x10;
                      (E9(W[EB] < J[EC]), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE();
                      if (EB == null)
                        throw new TypeError("Cannot iterate over " + EB);
                      let EC = EB[Symbol["iterator"]];
                      if (typeof EC !== "function")
                        throw new TypeError("Object is not iterable");
                      (E9(EC["call"](EB)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EB["next"]();
                      (E9(Promise["resolve"](EC)), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE();
                      (E9(EC instanceof EB), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = EE(),
                        ES = Em(),
                        Ek =
                          typeof ES === "function" && ES["prototype"]
                            ? ES["prototype"]
                            : ES;
                      (Object["defineProperty"](Ek, EC, {
                        set: EB,
                        enumerable: Ek === ES,
                        configurable: !![],
                      }),
                        a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      (E9(O), a++);
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = EE(),
                        EC = J[Es];
                      EB === null || EB === undefined
                        ? E9(undefined)
                        : E9(EB[EC]);
                      a++;
                      break;
                    }
                  },
                  function (Es) {
                    while (!![]) {
                      let EB = J[Es],
                        EC = EE();
                      if (EP["tdzVars"]) {
                        EB in EP["tdzVars"] && delete EP["tdzVars"][EB];
                        let ES = EB["split"]("$$")[0x0];
                        ES !== EB &&
                          ES in EP["tdzVars"] &&
                          delete EP["tdzVars"][ES];
                      }
                      ((EP["vars"][EB] = EC), a++);
                      break;
                    }
                  },
                ];
            Ep[ER[Et]](EF);
            if (Ei) return ((Ei = ![]), Ec);
          }
          break;
        } catch (Es) {
          if (E0["length"] > 0x0) {
            let EB = E0[E0["length"] - 0x1];
            T = EB["stackSize"];
            if (EB["catchIndex"] !== undefined)
              (E9(Es),
                (a = EB["catchIndex"]),
                (EB["catchIndex"] = undefined),
                EB["finallyIndex"] === undefined && E0["pop"]());
            else
              EB["finallyIndex"] !== undefined
                ? ((a = EB["finallyIndex"]), (EB["pendingException"] = Es))
                : ((a = EB["endIndex"]), E0["pop"]());
            continue;
          }
          throw Es;
        }
      }
      return T > 0x0 ? EE() : EK ? O : undefined;
    }
    let w = function (S, k, I, N, U) {
        K_26978d["_$CU4Rja"]
          ? (K_26978d["_$CU4Rja"] = ![])
          : (K_26978d["_$AuM0V8"] = undefined);
        let O = p(S);
        return Y(O, k, I, N, U, this);
      },
      x = async function (S, k, I, N, U, O) {
        let f = p(S),
          T = n(f, k, I, N, U, this),
          W = T["next"]();
        while (!W["done"]) {
          if (W["value"]["t"] === 0x1)
            try {
              let a = await Promise["resolve"](W["value"]["v"]);
              ((K_26978d["_$AuM0V8"] = O), (W = T["next"](a)));
            } catch (J) {
              ((K_26978d["_$AuM0V8"] = O), (W = T["throw"](J)));
            }
          else throw new Error("Unexpected yield in async context");
        }
        return W["value"];
      },
      d = function (S, k, I, N, U) {
        let O = p(S),
          f = n(O, k, I, N, undefined, this),
          T = ![],
          W = null,
          a = this,
          J = undefined,
          L = ![];
        function u(E2, E3) {
          if (T) return { value: undefined, done: !![] };
          K_26978d["_$AuM0V8"] = U;
          if (W) {
            let E5;
            try {
              E5 = E3
                ? typeof W["throw"] === "function"
                  ? W["throw"](E2)
                  : ((W = null),
                    (function () {
                      throw E2;
                    })())
                : W["next"](E2);
            } catch (E6) {
              W = null;
              try {
                let E7 = f["throw"](E6);
                return b(E7);
              } catch (E8) {
                T = !![];
                throw E8;
              }
            }
            if (!E5["done"]) return { value: E5["value"], done: ![] };
            ((W = null), (E2 = E5["value"]), (E3 = ![]));
          }
          let E4;
          try {
            E4 = E3 ? f["throw"](E2) : f["next"](E2);
          } catch (E9) {
            T = !![];
            throw E9;
          }
          return b(E4);
        }
        function b(E2) {
          if (E2["done"]) {
            T = !![];
            if (L) return ((L = ![]), { value: J, done: !![] });
            return { value: E2["value"], done: !![] };
          }
          let E3 = E2["value"];
          if (E3["t"] === 0x2) return { value: E3["v"], done: ![] };
          if (E3["t"] === 0x3) {
            let E4 = E3["v"],
              E5 = E4;
            E5 &&
              typeof E5[Symbol["iterator"]] === "function" &&
              (E5 = E5[Symbol["iterator"]]());
            if (E5 && typeof E5["next"] === "function") {
              let E6 = E5["next"]();
              if (!E6["done"])
                return ((W = E5), { value: E6["value"], done: ![] });
              return u(E6["value"], ![]);
            }
            return u(undefined, ![]);
          }
          throw new Error("Unexpected signal in generator");
        }
        let Z = O && O["s"],
          E0 = async function (E2) {
            if (T) return { value: E2, done: !![] };
            if (W && typeof W["return"] === "function") {
              try {
                await W["return"]();
              } catch (E4) {}
              W = null;
            }
            let E3;
            try {
              ((K_26978d["_$AuM0V8"] = U), (E3 = f["next"]({ t: 0x4, v: E2 })));
            } catch (E5) {
              T = !![];
              throw E5;
            }
            while (!E3["done"]) {
              let E6 = E3["value"];
              if (E6["t"] === 0x1)
                try {
                  let E7 = await Promise["resolve"](E6["v"]);
                  ((K_26978d["_$AuM0V8"] = U), (E3 = f["next"](E7)));
                } catch (E8) {
                  ((K_26978d["_$AuM0V8"] = U), (E3 = f["throw"](E8)));
                }
              else {
                if (E6["t"] === 0x2)
                  try {
                    ((K_26978d["_$AuM0V8"] = U), (E3 = f["next"]()));
                  } catch (E9) {
                    T = !![];
                    throw E9;
                  }
                else break;
              }
            }
            return ((T = !![]), { value: E3["value"], done: !![] });
          },
          E1 = function (E2) {
            if (T) return { value: E2, done: !![] };
            if (W && typeof W["return"] === "function") {
              try {
                W["return"]();
              } catch (E4) {}
              W = null;
            }
            ((J = E2), (L = !![]));
            let E3;
            try {
              ((K_26978d["_$AuM0V8"] = U), (E3 = f["next"]({ t: 0x4, v: E2 })));
            } catch (E5) {
              ((T = !![]), (L = ![]));
              throw E5;
            }
            if (!E3["done"] && E3["value"] && E3["value"]["t"] === 0x2)
              return { value: E3["value"]["v"], done: ![] };
            return ((T = !![]), (L = ![]), { value: E3["value"], done: !![] });
          };
        return Z
          ? {
              next: function (E2) {
                return u(E2, ![]);
              },
              return: E0,
              throw: function (E2) {
                if (T) throw E2;
                return u(E2, !![]);
              },
              [Symbol["asyncIterator"]]: function () {
                return this;
              },
            }
          : {
              next: function (E2) {
                return u(E2, ![]);
              },
              return: E1,
              throw: function (E2) {
                if (T) throw E2;
                return u(E2, !![]);
              },
              [Symbol["iterator"]]: function () {
                return this;
              },
            };
      };
    return function (S, k, I, N, U) {
      let O = p(S);
      if (O && O["g"]) {
        let f = K_26978d["_$AuM0V8"];
        return d["call"](this, S, k, I, N, f);
      } else {
        if (O && O["s"]) {
          let T = K_26978d["_$AuM0V8"];
          return x["call"](this, S, k, I, N, U, T);
        } else return w["call"](this, S, k, I, N, U);
      }
    };
  })();
  try {
    K_26978d["MutationObserver"] = MutationObserver;
  } catch (mm) {}
  try {
    K_26978d["document"] = document;
  } catch (mA) {}
  ((K_26978d["lockSystem"] = lockSystem),
    (K_26978d["createSignature"] = createSignature),
    (K_26978d["observeSignature"] = observeSignature),
    (K_26978d["getOriginalSignature"] = getOriginalSignature));
  function getOriginalSignature() {
    return r_e8e218["call"](
      this,
      0x0,
      Array["from"](arguments),
      undefined,
      getOriginalSignature,
      new.target,
    );
  }
  function observeSignature() {
    return r_e8e218["call"](
      this,
      0x2,
      Array["from"](arguments),
      undefined,
      observeSignature,
      new.target,
    );
  }
  function createSignature() {
    return r_e8e218["call"](
      this,
      0x3,
      Array["from"](arguments),
      undefined,
      createSignature,
      new.target,
    );
  }
  let tamperTriggered = ![];
  K_26978d["tamperTriggered"] = tamperTriggered;
  ((globalThis["tamperTriggered"] = K_26978d["tamperTriggered"]),
    (K_26978d["tamperTriggered"] = K_26978d["tamperTriggered"]));
  globalThis["tamperTriggered"] = K_26978d["tamperTriggered"];
  function lockSystem() {
    return r_e8e218["call"](
      this,
      0x4,
      Array["from"](arguments),
      undefined,
      lockSystem,
      new.target,
    );
  }
  (createSignature(), observeSignature());
});
