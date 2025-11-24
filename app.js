// Tailwind config (tema personalizado)
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        franz: {
          dark: "#0f172a",
          accent: "#3b82f6",
          secondary: "#64748b",
          light: "#f8fafc",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
};

/**
 * App Namespace
 * Estructura modular para organizar la lógica de la aplicación
 */
const App = {
  // --- 0. Config global (base URL, tamaño QR, etc.) ---
  Config: {
    /**
     * Base para generar la URL pública de la tarjeta.
     * Ejemplos soportados:
     *  - "https://vcardsnew.markekint.com/employee.html?id={id}"
     *  - "https://vcardsnew.markekint.com/employee.html?id="
     *  - "https://vcardsnew.markekint.com/card/"
     *  - "https://vcardsnew.markekint.com/card"
     *  - "https://vcardsnew.markekint.com/?id="
     */
    baseCardUrl: "https://vcardsnew.markekint.com/employee.html?id={id}",
    qrSize: 200,
    primaryColor: "#0f172a",
  },

  // --- 1. Store (Gestión de Estado y Datos) ---
  Store: {
    employees: [
      {
        id: 1,
        name: "CEO General",
        role: "CEO & Founder",
        dept: "Dirección",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        status: "active",
        phone: "+525512345601",
        whatsapp: "525512345601",
        email: "ceo.looks@gmail.com",
      },
      {
        id: 2,
        name: "Eduardo Aviles",
        role: "Director de Tecnología",
        dept: "IT",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
        status: "active",
        phone: "+525512345602",
        whatsapp: "525512345602",
        email: "eduardo.aviles@kint.com",
      },
      {
        id: 3,
        name: "Said Aviles",
        role: "Director de Operaciones",
        dept: "Operaciones",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        status: "active",
        phone: "+525512345603",
        whatsapp: "525512345603",
        email: "said.aviles@kint.com",
      },
      {
        id: 4,
        name: "Diego Camargo",
        role: "Lead Developer",
        dept: "Desarrollo",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        status: "active",
        phone: "+525512345604",
        whatsapp: "525512345604",
        email: "diego.camargo@kint.com",
      },
      {
        id: 5,
        name: "Ana Garcia",
        role: "Gerente de Ventas",
        dept: "Ventas",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        status: "active",
        phone: "+525512345605",
        whatsapp: "525512345605",
        email: "ana.garcia@kint.com",
      },
    ],
    currentFilterDept: null,
    getEmployee: (id) => App.Store.employees.find((e) => e.id === id),
    addEmployee: (emp) => {
      App.Store.employees.unshift(emp);
    },
    getAll: () => {
      if (!App.Store.currentFilterDept) return App.Store.employees;
      return App.Store.employees.filter(
        (e) =>
          (e.dept || "").toLowerCase() ===
          App.Store.currentFilterDept.toLowerCase()
      );
    },
  },

  // --- 2. Services (Funcionalidades Externas/Utilidades) ---
  Services: {
    // Centraliza cómo se construye la URL pública de la tarjeta
    Links: {
      cardUrl: (id) => {
        const base = (App.Config.baseCardUrl || "").trim();
        const idStr = String(id);

        if (!base) {
          // Fallback seguro
          return `https://vcardsnew.markekint.com/employee.html?id=${idStr}`;
        }

        // Si el base contiene {id}, se reemplaza
        if (base.includes("{id}")) {
          return base.replace("{id}", idStr);
        }

        // Si termina con "/" o "=", concatenamos directamente
        if (base.endsWith("/") || base.endsWith("=")) {
          return `${base}${idStr}`;
        }

        // Por defecto, añadimos "/" + id
        return `${base}/${idStr}`;
      },
    },

    // Generación de QR apuntando SIEMPRE a la URL de tarjeta correspondiente
    QR: {
      generateUrl: (employeeId) => {
        const targetUrl = App.Services.Links.cardUrl(employeeId);
        const size = App.Config.qrSize || 200;

        // color fijo por ahora, podrías mapear desde App.Config.primaryColor
        const colorHex = "0f172a";

        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
          targetUrl
        )}&color=${colorHex}&bgcolor=ffffff`;
      },
    },

    UploadSimulator: {
      start: () => {
        const ui = App.Components.Modals.Upload.ui;
        if (!ui.initial) return;

        ui.initial.classList.add("hidden");
        ui.loading.classList.remove("hidden");

        let width = 0;
        const interval = setInterval(() => {
          if (width >= 100) {
            clearInterval(interval);
            ui.loading.classList.add("hidden");
            ui.success.classList.remove("hidden");
            ui.success.classList.add("animate-slide-up");
            ui.btnFinish.classList.remove("hidden");

            setTimeout(() => {
              App.Store.addEmployee({
                id: Date.now(),
                name: "Nuevo Empleado " + Math.floor(Math.random() * 100),
                role: "Analista",
                dept: "Operaciones",
                avatar: "https://randomuser.me/api/portraits/men/99.jpg",
                status: "active",
                phone: "+525500000000",
                whatsapp: "525500000000",
                email: "nuevo.empleado@franzlooks.com",
              });
              App.Components.Table.render();
              App.Components.QRGrid.render();
            }, 500);
          } else {
            width += Math.random() * 10;
            if (width > 100) width = 100;
            ui.progress.style.width = width + "%";
            ui.progressText.innerText = Math.floor(width) + "% completado";
          }
        }, 200);
      },
    },
  },

  // --- 3. UI Components (Renderizado) ---
  Components: {
    // Generador de HTML de Tarjeta (Reutilizable)
    CardRenderer: {
      generateHTML: (employee, isPreview = false) => {
        const qrUrl = App.Services.QR.generateUrl(employee.id);

        return `
          <div class="h-full bg-white">
            <div class="h-48 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative ${
              isPreview ? "rounded-b-[2rem]" : "rounded-b-[2.5rem]"
            } overflow-hidden">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              ${
                !isPreview
                  ? `
              <div class="absolute top-8 left-0 w-full flex justify-between px-6 text-white/80">
                <i class="fa-solid fa-bars text-xl"></i>
                <i class="fa-solid fa-share-nodes text-xl"></i>
              </div>`
                  : ""
              }
            </div>

            <div class="px-6 ${
              isPreview ? "-mt-16" : "-mt-32"
            } relative pb-12">
              <div class="bg-white/90 backdrop-blur-md border border-slate-100 rounded-3xl p-6 text-center shadow-xl relative z-10">
                <div class="${
                  isPreview ? "w-24 h-24" : "w-32 h-32"
                } mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200 mb-4 relative ${
          isPreview ? "" : "-mt-24"
        }">
                  <img src="${
                    employee.avatar
                  }" class="w-full h-full object-cover">
                </div>
                <h2 class="${
                  isPreview ? "text-xl" : "text-2xl"
                } font-bold text-slate-800 mb-1">${employee.name}</h2>
                <p class="text-blue-600 font-medium text-xs uppercase">${
                  employee.role
                }</p>
                <p class="text-xs text-slate-500 mt-1">${employee.dept}</p>
                
                <div class="grid grid-cols-3 gap-4 mt-6">
                  <!-- Llamar -->
                  <a href="tel:${
                    employee.phone || ""
                  }" class="flex flex-col items-center gap-1 group">
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                      <i class="fa-solid fa-phone"></i>
                    </div>
                    <span class="text-[10px] text-slate-400">Llamar</span>
                  </a>
                  <!-- WhatsApp -->
                  <a href="https://wa.me/${
                    employee.whatsapp || ""
                  }" target="_blank" rel="noopener" class="flex flex-col items-center gap-1 group">
                    <div class="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                      <i class="fa-brands fa-whatsapp text-lg"></i>
                    </div>
                    <span class="text-[10px] text-slate-400">Whats</span>
                  </a>
                  <!-- Email -->
                  <a href="mailto:${
                    employee.email || ""
                  }" class="flex flex-col items-center gap-1 group">
                    <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors shadow-sm">
                      <i class="fa-solid fa-envelope"></i>
                    </div>
                    <span class="text-[10px] text-slate-400">Email</span>
                  </a>
                </div>
              </div>

              <div class="mt-4 space-y-2">
                <div class="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                  <div class="text-slate-400 text-xs"><i class="fa-solid fa-globe"></i></div>
                  <div class="text-xs text-slate-600 font-medium">vcardsnew.markekint.com</div>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border border-slate-100">
                  <div class="text-slate-400 text-xs"><i class="fa-solid fa-location-dot"></i></div>
                  <div class="text-xs text-slate-600 font-medium">CDMX, México</div>
                </div>
              </div>

              <div class="mt-8 text-center">
                <div class="inline-block p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <img src="${qrUrl}" class="w-24 h-24" alt="QR ${employee.name}">
                </div>
                <p class="text-[10px] text-slate-400 mt-2 font-medium">Escanear para compartir</p>
              </div>

              <button onclick="App.Actions.contact.save(${
                employee.id
              })" class="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <i class="fa-solid fa-user-plus"></i> Guardar Contacto
              </button>
            </div>
          </div>
        `;
      },
    },

    // Tabla de Empleados (Admin)
    Table: {
      render: () => {
        const tbody = document.getElementById("employee-table-body");
        if (!tbody) return;
        tbody.innerHTML = "";
        App.Store.getAll().forEach((emp) => {
          const row = document.createElement("tr");
          row.className =
            "hover:bg-slate-50 transition-colors cursor-pointer group";
          row.onclick = (e) => {
            if (!e.target.closest("button")) App.Router.openPreview(emp.id);
          };
          row.innerHTML = `
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img src="${emp.avatar}" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm">
                <div>
                  <div class="font-bold text-slate-700">${emp.name}</div>
                  <div class="text-xs text-slate-400">${emp.role}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 font-medium text-slate-600">${emp.role}</td>
            <td class="px-6 py-4">
              <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">${emp.dept}</span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mx-auto shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="App.Components.Modals.QR.open(${
                  emp.id
                }); event.stopPropagation()" class="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                  <i class="fa-solid fa-qrcode"></i>
                </button>
                <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                  <i class="fa-solid fa-pen"></i>
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      },
    },

    // Grid de QRs (vista "Códigos QR")
    QRGrid: {
      render: () => {
        const container = document.getElementById("qr-grid");
        if (!container) return;

        container.innerHTML = "";
        const employees = App.Store.getAll();

        employees.forEach((emp) => {
          const card = document.createElement("div");
          card.className =
            "bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow";

          const qrUrl = App.Services.QR.generateUrl(emp.id);
          const link = App.Services.Links.cardUrl(emp.id);

          card.innerHTML = `
            <div class="flex items-center gap-3">
              <img src="${emp.avatar}" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm">
              <div>
                <div class="font-semibold text-slate-800 text-sm">${emp.name}</div>
                <div class="text-xs text-slate-400">${emp.role} · ${emp.dept}</div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <img src="${qrUrl}" alt="QR ${emp.name}" class="w-24 h-24">
              </div>
              <div class="flex flex-col gap-2 flex-1">
                <button
                  onclick="App.Components.Modals.QR.open(${emp.id})"
                  class="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <i class="fa-solid fa-maximize mr-1"></i> Ver en modal
                </button>
                <button
                  onclick="navigator.clipboard && navigator.clipboard.writeText('${link}').then(() => App.UI.showToast('Enlace copiado')).catch(() => App.UI.showToast('No se pudo copiar, copia manualmente'));"
                  class="w-full px-3 py-2 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <i class="fa-solid fa-link mr-1"></i> Copiar enlace
                </button>
              </div>
            </div>

            <a href="${link}" target="_blank" rel="noopener"
               class="text-[11px] text-slate-400 break-all select-all hover:text-blue-600 transition-colors">
              ${link}
            </a>
          `;

          container.appendChild(card);
        });
      },
    },

    // Modales
    Modals: {
      Upload: {
        toggle: () => {
          const modal = document.getElementById("upload-modal");
          const content = document.getElementById("upload-modal-content");
          if (!modal || !content) return;

          if (modal.classList.contains("hidden")) {
            modal.classList.remove("hidden");
            setTimeout(() => {
              modal.classList.remove("opacity-0");
              content.classList.remove("scale-95");
              content.classList.add("scale-100");
            }, 10);
            App.Components.Modals.Upload.reset();
          } else {
            modal.classList.add("opacity-0");
            content.classList.remove("scale-100");
            content.classList.add("scale-95");
            setTimeout(() => modal.classList.add("hidden"), 300);
          }
        },
        reset: () => {
          const ui = App.Components.Modals.Upload.ui;
          if (!ui.initial) return;
          ui.initial.classList.remove("hidden");
          ui.loading.classList.add("hidden");
          ui.success.classList.add("hidden");
          ui.btnFinish.classList.add("hidden");
          ui.progress.style.width = "0%";
          ui.progressText.innerText = "0% completado";
        },
        get ui() {
          return {
            initial: document.getElementById("upload-initial-state"),
            loading: document.getElementById("upload-loading-state"),
            success: document.getElementById("upload-success-state"),
            btnFinish: document.getElementById("btn-finish-upload"),
            progress: document.getElementById("progress-bar"),
            progressText: document.getElementById("upload-progress-text"),
          };
        },
      },
      QR: {
        open: (id) => {
          const emp = App.Store.getEmployee(id);
          if (!emp) return;
          const nameEl = document.getElementById("qr-modal-name");
          const roleEl = document.getElementById("qr-modal-role");
          const imgEl = document.getElementById("qr-modal-img");
          if (!nameEl || !roleEl || !imgEl) return;

          nameEl.innerText = emp.name;
          roleEl.innerText = emp.role;
          imgEl.src = App.Services.QR.generateUrl(emp.id);
          App.Components.Modals.QR.toggle();
        },
        toggle: () => {
          const modal = document.getElementById("qr-modal");
          const content = document.getElementById("qr-modal-content");
          if (!modal || !content) return;

          if (modal.classList.contains("hidden")) {
            modal.classList.remove("hidden");
            setTimeout(() => {
              modal.classList.remove("opacity-0");
              content.classList.remove("scale-95");
              content.classList.add("scale-100");
            }, 10);
          } else {
            modal.classList.add("opacity-0");
            content.classList.remove("scale-100");
            content.classList.add("scale-95");
            setTimeout(() => modal.classList.add("hidden"), 300);
          }
        },
      },
    },
  },

  // --- 4. Dashboard (simulación escaneos + gráfica con Chart.js) ---
  Dashboard: {
    chart: null,
    data: [],
    labels: [],
    intervalId: null,
    periodMinutes: 15,
    totalMonth: 1452,

    init() {
      const totalEl = document.getElementById("scan-total-month");
      if (totalEl) totalEl.innerText = this.totalMonth.toLocaleString("es-MX");

      const ctx = document.getElementById("scan-chart");
      if (!ctx || typeof Chart === "undefined") return;

      const points = this.periodMinutes;
      this.data = Array(points).fill(0);
      this.labels = Array.from({ length: points }, (_, i) => `${i + 1} min`);

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.labels,
          datasets: [
            {
              label: "Escaneos",
              data: this.data,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: "#94a3b8", font: { size: 10 } },
              grid: { display: false },
            },
            y: {
              ticks: { color: "#94a3b8", font: { size: 10 } },
              grid: { color: "#e2e8f0" },
              beginAtZero: true,
              suggestedMax: 10,
            },
          },
        },
      });

      this.intervalId = setInterval(() => this.tick(), 2000);
    },

    setPeriod(mins) {
      this.periodMinutes = mins;
      if (!this.chart) return;

      this.data = Array(mins).fill(0);
      this.labels = Array.from({ length: mins }, (_, i) => `${i + 1} min`);

      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.data;
      this.chart.update();
    },

    tick() {
      const lastMinuteEl = document.getElementById("scan-last-minute");
      const totalEl = document.getElementById("scan-total-month");
      const logEl = document.getElementById("scan-log");

      const scans = Math.floor(Math.random() * 6); // 0-5
      this.data.shift();
      this.data.push(scans);

      if (this.chart) {
        this.chart.data.datasets[0].data = this.data;
        this.chart.update("none");
      }

      if (lastMinuteEl) {
        lastMinuteEl.innerText = scans.toString();
      }

      this.totalMonth += scans;
      if (totalEl) {
        totalEl.innerText = this.totalMonth.toLocaleString("es-MX");
      }

      if (logEl) {
        const timestamp = new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const line = document.createElement("div");
        line.className =
          "flex items-center justify-between text-[11px] text-slate-500";
        line.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full ${
              scans > 0 ? "bg-emerald-400" : "bg-slate-300"
            }"></span>
            <span>${
              scans > 0
                ? `${scans} escaneo(s) registrados`
                : "Sin actividad"
            }</span>
          </div>
          <span class="text-[10px] text-slate-400">${timestamp}</span>
        `;

        logEl.prepend(line);
        while (logEl.children.length > 30) {
          logEl.removeChild(logEl.lastChild);
        }
      }
    },
  },

  // --- 5. Actions (acciones de negocio) ---
  Actions: {
    contact: {
      save: (id) => {
        const emp = App.Store.getEmployee(id);
        if (!emp) return;

        const org = "Franz Looks";
        const vcardLines = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${emp.name}`,
          `TITLE:${emp.role}`,
          `ORG:${org}`,
          emp.phone ? `TEL;TYPE=WORK,VOICE:${emp.phone}` : "",
          emp.email ? `EMAIL;TYPE=WORK:${emp.email}` : "",
          "END:VCARD",
        ].filter(Boolean);

        const vcard = vcardLines.join("\n");
        const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = (emp.name || "contacto").replace(/\s+/g, "_") + ".vcf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        App.UI.showToast(`vCard generada para ${emp.name}`);
      },
    },
    admin: {
      filterByDeptPrompt: () => {
        const dept = prompt(
          "Escribe el nombre del departamento para filtrar (por ejemplo: IT, Ventas, Desarrollo). Deja vacío para ver todos."
        );
        if (!dept) {
          App.Store.currentFilterDept = null;
          App.Components.Table.render();
          App.Components.QRGrid.render();
          App.UI.showToast("Filtro eliminado. Mostrando todos los empleados.");
        } else {
          App.Store.currentFilterDept = dept;
          App.Components.Table.render();
          App.Components.QRGrid.render();
          App.UI.showToast(`Filtro aplicado: ${dept}`);
        }
      },
      searchEmployees: (term) => {
        const tbody = document.getElementById("employee-table-body");
        if (!tbody) return;

        const normalized = (term || "").toLowerCase();
        tbody.querySelectorAll("tr").forEach((row) => {
          const text = row.innerText.toLowerCase();
          row.style.display = !normalized || text.includes(normalized) ? "" : "none";
        });
      },
      saveSettings: (event) => {
        if (event) event.preventDefault();
        const baseUrl = document.getElementById("setting-base-url")?.value;
        const size = document.getElementById("setting-qr-size")?.value;
        const primary = document.getElementById("setting-primary-color")?.value;
        const track = document.getElementById("setting-track-scans")?.checked;
        const autoGen = document.getElementById("setting-auto-generate")?.checked;

        if (baseUrl) App.Config.baseCardUrl = baseUrl;
        if (size) App.Config.qrSize = parseInt(size, 10) || 200;
        if (primary) App.Config.primaryColor = primary;

        console.log("Settings guardados (demo):", {
          baseUrl: App.Config.baseCardUrl,
          qrSize: App.Config.qrSize,
          primaryColor: App.Config.primaryColor,
          track,
          autoGen,
        });

        App.UI.showToast("Configuración guardada (demo)");
        App.Components.QRGrid.render();
      },
      resetSettings: () => {
        const baseUrl = document.getElementById("setting-base-url");
        const size = document.getElementById("setting-qr-size");
        const primary = document.getElementById("setting-primary-color");
        const track = document.getElementById("setting-track-scans");
        const autoGen = document.getElementById("setting-auto-generate");

        App.Config.baseCardUrl =
          "https://vcardsnew.markekint.com/employee.html?id={id}";
        App.Config.qrSize = 200;
        App.Config.primaryColor = "#0f172a";

        if (baseUrl) baseUrl.value = App.Config.baseCardUrl;
        if (size) size.value = App.Config.qrSize;
        if (primary) primary.value = App.Config.primaryColor;
        if (track) track.checked = true;
        if (autoGen) autoGen.checked = true;

        App.UI.showToast("Valores por defecto restaurados");
        App.Components.QRGrid.render();
      },
    },
    layout: {
      toggleSidebar: () => {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) return;
        sidebar.classList.toggle("-translate-x-full");
      },
    },
  },

  // --- 6. Router (Navegación) ---
  Router: {
    login: (role) => {
      const loginScreen = document.getElementById("login-screen");
      const adminApp = document.getElementById("admin-app");
      const employeeApp = document.getElementById("employee-app");

      if (!loginScreen || !adminApp || !employeeApp) return;

      loginScreen.classList.add("opacity-0", "pointer-events-none");
      setTimeout(() => loginScreen.classList.add("hidden"), 500);

      if (role === "admin") {
        adminApp.classList.remove("hidden");
        setTimeout(() => adminApp.classList.remove("opacity-0"), 100);
        App.Components.Table.render();
        App.Components.QRGrid.render();
        App.Dashboard.init();
      } else {
        employeeApp.classList.remove("hidden");
        setTimeout(() => employeeApp.classList.remove("opacity-0"), 100);
        const emp = App.Store.getEmployee(1);
        if (emp) {
          document.getElementById("employee-app-content").innerHTML =
            App.Components.CardRenderer.generateHTML(emp, false);
        }
      }
    },

    switchAdminTab: (tab) => {
      const sections = {
        dashboard: "dashboard-view",
        employees: "employees-view",
        qrs: "qr-view",
        settings: "settings-view",
      };

      Object.values(sections).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });

      const preview = document.getElementById("preview-view");
      if (preview) preview.classList.add("hidden");

      const targetId = sections[tab] || sections.dashboard;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.remove("hidden");

      const navButtons = document.querySelectorAll("#sidebar .nav-item");
      navButtons.forEach((btn) => {
        btn.classList.remove("bg-blue-50", "text-blue-700");
        btn.classList.add("text-slate-500");
      });
      const activeBtn = document.querySelector(
        `#sidebar .nav-item[data-tab="${tab}"]`
      );
      if (activeBtn) {
        activeBtn.classList.add("bg-blue-50", "text-blue-700");
        activeBtn.classList.remove("text-slate-500");
      }

      if (tab === "dashboard" && !App.Dashboard.chart) {
        App.Dashboard.init();
      }
    },

    openPreview: (id) => {
      const emp = App.Store.getEmployee(id);
      const previewIframe = document.getElementById("preview-iframe");
      if (!previewIframe || !emp) return;

      ["dashboard-view", "employees-view", "qr-view", "settings-view"].forEach(
        (idSection) => {
          const el = document.getElementById(idSection);
          if (el) el.classList.add("hidden");
        }
      );

      const prev = document.getElementById("preview-view");
      if (prev) {
        previewIframe.innerHTML = App.Components.CardRenderer.generateHTML(
          emp,
          true
        );
        prev.classList.remove("hidden");
        prev.classList.add("animate-fade-in");
      }
    },

    logout: () => location.reload(),
  },

  // --- 7. Utilities ---
  UI: {
    showToast: (msg) => {
      const toast = document.getElementById("toast");
      const msgEl = document.getElementById("toast-msg");
      if (!toast || !msgEl) return;

      msgEl.innerText = msg;
      toast.classList.remove("translate-y-20", "opacity-0");
      setTimeout(
        () => toast.classList.add("translate-y-20", "opacity-0"),
        3000
      );
    },
  },

  // --- 8. Init (con soporte para distintos layouts) ---
  init: () => {
    console.log("Franz Looks App Initialized");

    const loginScreen = document.getElementById("login-screen");
    const adminApp = document.getElementById("admin-app");
    const employeeApp = document.getElementById("employee-app");

    // Sincronizar Config con el formulario de settings (si existe)
    const baseInput = document.getElementById("setting-base-url");
    if (baseInput && baseInput.value) {
      App.Config.baseCardUrl = baseInput.value;
    }
    const sizeInput = document.getElementById("setting-qr-size");
    if (sizeInput && sizeInput.value) {
      App.Config.qrSize = parseInt(sizeInput.value, 10) || 200;
    }
    const primaryInput = document.getElementById("setting-primary-color");
    if (primaryInput && primaryInput.value) {
      App.Config.primaryColor = primaryInput.value;
    }

    // Caso 1: Página solo admin (admin-app sin login-screen)
    if (!loginScreen && adminApp && !employeeApp) {
      adminApp.classList.remove("hidden", "opacity-0");
      App.Components.Table.render();
      App.Components.QRGrid.render();
      App.Dashboard.init();

      const toggleBtn = document.getElementById("sidebar-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", App.Actions.layout.toggleSidebar);
      }
      return;
    }

    // Caso 2: Página solo empleado (employee-app sin login-screen)
    if (!loginScreen && employeeApp && !adminApp) {
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = parseInt(params.get("id") || "1", 10);
      const emp = App.Store.getEmployee(idFromUrl) || App.Store.getEmployee(1);

      if (emp) {
        const container = document.getElementById("employee-app-content");
        if (container) {
          container.innerHTML = App.Components.CardRenderer.generateHTML(
            emp,
            false
          );
        }
      }

      employeeApp.classList.remove("hidden", "opacity-0");
      return;
    }

    // Caso 3: Página demo con login-screen (SPA original / entorno demo)
    App.Components.Table.render();
    App.Components.QRGrid.render();
    App.Dashboard.init();
    const toggleBtn = document.getElementById("sidebar-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", App.Actions.layout.toggleSidebar);
    }
  },
};

// Iniciar Aplicación
document.addEventListener("DOMContentLoaded", App.init);
