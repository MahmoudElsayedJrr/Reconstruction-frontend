document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("loggedInUserToken");
  const role = localStorage.getItem("loggedInUserRole");

  // 1. Strict Security Guard: Only Super Admin can access this page
  if (!token || role !== "super_admin") {
    alert("عفواً، هذه الصفحة مخصصة لـ Super Admin فقط.");
    window.location.href = "dashboard.html";
    return;
  }

  // DOM Elements
  const usersTableBody = document.getElementById("usersTableBody");
  const usersCountBadge = document.getElementById("usersCountBadge");
  const searchInput = document.getElementById("searchUserInput");
  const toastContainer = document.getElementById("toastContainer");

  // Delete Modal Elements
  const deleteModalElement = document.getElementById("deleteUserModal");
  let deleteModal = null;
  if (deleteModalElement) {
    deleteModal = new bootstrap.Modal(deleteModalElement);
  }
  const deleteUserNameDisplay = document.getElementById("deleteUserNameDisplay");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  let allUsers = [];
  let userToDelete = null;

  const roleLabels = {
    super_admin: "سوبر أدمن",
    admin: "أدمن",
    manager: "تخطيط ومتابعة",
    executive: "تنفيذية",
    financial: "مالي",
    projectManager: "مشروعات",
    contractual: "تعاقدية",
    employee: "موظف",
  };

  // Toast notification helper
  function showToast(message, type = "success") {
    if (!toastContainer) {
      alert(message);
      return;
    }
    const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
    const toastBg = type === "success" ? "bg-success" : "bg-danger";
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${toastBg} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    toast.show();
  }

  // 2. Fetch Users from Backend API
  async function fetchUsers() {
    if (!usersTableBody) return;

    usersTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="loading-indicator">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">جاري التحميل...</span>
            </div>
            <p class="mt-2 mb-0">جاري تحميل بيانات المستخدمين...</p>
          </div>
        </td>
      </tr>`;

    try {
      const res = await fetch(`${API_URL}users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          showToast("غير مسموح لك بالوصول لهذه البيانات (Super Admin فقط)", "danger");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1500);
          return;
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "فشل في تحميل المستخدمين");
      }

      const responseData = await res.json();
      allUsers = responseData.data || [];

      renderUsers();
    } catch (error) {
      console.error("Fetch users error:", error);
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state text-danger">
              <i class="fas fa-circle-exclamation text-danger"></i>
              <p>${error.message || "حدث خطأ أثناء الاتصال بالخادم."}</p>
              <button class="btn btn-outline-primary btn-sm mt-2" onclick="location.reload()">
                <i class="fas fa-rotate-right me-1"></i> إعادة المحاولة
              </button>
            </div>
          </td>
        </tr>`;
      showToast(error.message || "حدث خطأ أثناء الاتصال بالسيرفر", "danger");
    }
  }

  // 3. Render Users Table
  function renderUsers() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const filtered = allUsers.filter((u) => {
      return (
        !query ||
        (u.name && u.name.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (roleLabels[u.role] && roleLabels[u.role].toLowerCase().includes(query)) ||
        (u.region && u.region.toLowerCase().includes(query))
      );
    });

    if (usersCountBadge) {
      usersCountBadge.textContent = `${filtered.length} مستخدم`;
    }

    if (filtered.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <i class="fas fa-users-slash"></i>
              <p>لم يتم العثور على أي مستخدمين.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    let rowsHTML = "";
    filtered.forEach((u, index) => {
      const isSuper = u.role === "super_admin";
      const roleText = roleLabels[u.role] || u.role;
      const initial = u.name ? u.name.trim().charAt(0).toUpperCase() : "U";

      // Format date
      let createdDate = "—";
      if (u.createdAt) {
        const d = new Date(u.createdAt);
        createdDate = d.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      rowsHTML += `
        <tr>
          <td class="text-center fw-bold text-muted">${index + 1}</td>
          <td>
            <div class="user-cell">
              <div class="user-avatar ${isSuper ? "super-admin" : ""}">
                ${initial}
              </div>
              <div class="user-meta">
                <div class="user-name">
                  ${escapeHtml(u.name)}
                  ${isSuper ? '<i class="fas fa-crown text-warning me-1" title="سوبر أدمن"></i>' : ""}
                </div>
              </div>
            </div>
          </td>
          <td>
            ${u.email ? `<span class="text-dark"><i class="far fa-envelope me-1 text-muted"></i>${escapeHtml(u.email)}</span>` : '<span class="text-muted">—</span>'}
          </td>
          <td>
            <span class="role-badge ${u.role}">
              <i class="${getRoleIcon(u.role)}"></i>
              ${roleText}
            </span>
          </td>
          <td>
            <span class="badge bg-light text-dark border">
              <i class="fas fa-location-dot me-1 text-primary"></i>${escapeHtml(u.region || "الكل")}
            </span>
          </td>
          <td class="text-center">
            ${
              u.isLocked
                ? `<span class="status-pill locked"><i class="fas fa-lock me-1"></i>مقفل</span>`
                : `<span class="status-pill active"><i class="fas fa-check-circle me-1"></i>نشط</span>`
            }
          </td>
          <td>
            <small class="text-muted">${createdDate}</small>
          </td>
          <td class="text-center">
            <div class="d-flex align-items-center justify-content-center gap-1">
              ${
                u.isLocked
                  ? `<button class="btn-action btn-unlock" data-name="${escapeHtml(u.name)}" title="فك قفل الحساب">
                       <i class="fas fa-key"></i>
                     </button>`
                  : ""
              }
              <button 
                class="btn-action btn-delete" 
                data-name="${escapeHtml(u.name)}" 
                data-role="${u.role}"
                ${isSuper ? "disabled title='غير مسموح بحذف حساب السوبر أدمن'" : "title='حذف المستخدم'"}
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>`;
    });

    usersTableBody.innerHTML = rowsHTML;

    // Attach Action Listeners
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const userRole = btn.getAttribute("data-role");
        if (userRole === "super_admin") {
          showToast("غير مسموح بحذف حساب السوبر أدمن نهائياً", "danger");
          return;
        }
        openDeleteModal(name);
      });
    });

    document.querySelectorAll(".btn-unlock").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        unlockUser(name);
      });
    });
  }

  // Helper for role icons
  function getRoleIcon(role) {
    switch (role) {
      case "super_admin":
        return "fas fa-shield-halved";
      case "admin":
        return "fas fa-user-shield";
      case "manager":
        return "fas fa-chart-pie";
      case "executive":
        return "fas fa-briefcase";
      case "financial":
        return "fas fa-coins";
      case "projectManager":
        return "fas fa-diagram-project";
      case "contractual":
        return "fas fa-file-signature";
      default:
        return "fas fa-user";
    }
  }

  // Helper to escape HTML characters
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 4. Open Delete Modal
  function openDeleteModal(name) {
    userToDelete = name;
    if (deleteUserNameDisplay) {
      deleteUserNameDisplay.textContent = name;
    }
    if (deleteModal) {
      deleteModal.show();
    }
  }

  // 5. Confirm Delete User
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (!userToDelete) return;

      const deleteBtnOriginal = confirmDeleteBtn.innerHTML;
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        جاري الحذف...`;

      try {
        const res = await fetch(
          `${API_URL}users/${encodeURIComponent(userToDelete)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          showToast(`تم حذف المستخدم (${userToDelete}) بنجاح`, "success");
          if (deleteModal) deleteModal.hide();
          userToDelete = null;
          await fetchUsers();
        } else {
          const errData = await res.json().catch(() => ({}));
          showToast(errData.message || "فشل حذف المستخدم", "danger");
        }
      } catch (err) {
        console.error("Delete user error:", err);
        showToast("فشل الاتصال بالسيرفر أثناء الحذف", "danger");
      } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.innerHTML = deleteBtnOriginal;
      }
    });
  }

  // 6. Unlock User
  async function unlockUser(name) {
    try {
      const res = await fetch(
        `${API_URL}users/${encodeURIComponent(name)}/unlock`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        showToast(`تم فك قفل حساب المستخدم (${name}) بنجاح`, "success");
        await fetchUsers();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || "فشل فك قفل الحساب", "danger");
      }
    } catch (err) {
      console.error("Unlock user error:", err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  }

  // 7. Search Input Event Listener
  if (searchInput) {
    searchInput.addEventListener("input", renderUsers);
  }

  // Initial load
  fetchUsers();
});
