const defaultCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    price: 15000,
    fuel: "Gasoline",
    image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
    description: "Reliable sedan with strong resale value and excellent mileage."
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2021,
    price: 17900,
    fuel: "Hybrid",
    image_url: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1000&q=80",
    description: "Efficient daily driver with modern infotainment and low running cost."
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 34800,
    fuel: "Electric",
    image_url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1000&q=80",
    description: "Premium electric sedan with autopilot features and rapid acceleration."
  },
  {
    id: 4,
    make: "BMW",
    model: "320i",
    year: 2019,
    price: 22900,
    fuel: "Diesel",
    image_url: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1000&q=80",
    description: "Executive comfort and sporty handling with a refined interior."
  }
]

const CARS_KEY = "drivenest_catalog"
const ROLE_KEY = "drivenest_role"
const CONTACT_KEY = "drivenest_contact"

const ADMIN_ACCOUNTS = [
  { email: "admin1@drivenest.com", password: "admin123" },
  { email: "admin2@drivenest.com", password: "admin456" },
  { email: "admin3@drivenest.com", password: "admin789" }
]

const CONTACT_ITEMS = [
  { key: "whatsapp", label: "WhatsApp", icon: "https://cdn.simpleicons.org/whatsapp/25D366", newTab: true },
  { key: "instagram", label: "Instagram", icon: "https://cdn.simpleicons.org/instagram/E4405F", newTab: true },
  { key: "facebook", label: "Facebook", icon: "https://cdn.simpleicons.org/facebook/1877F2", newTab: true },
  { key: "tiktok", label: "TikTok", icon: "https://cdn.simpleicons.org/tiktok/000000", newTab: true },
  { key: "email", label: "Email", icon: "https://cdn.simpleicons.org/gmail/EA4335", newTab: false },
  { key: "phone", label: "Phone", icon: "https://cdn.simpleicons.org/phonepe/5F259F", newTab: false }
]

const defaultContactInfo = {
  whatsapp_value: "+92 300 1234567",
  whatsapp_link: "https://wa.me/923001234567",
  instagram_value: "@premiumcarstz",
  instagram_link: "https://www.instagram.com/premiumcarstz",
  facebook_value: "facebook.com/premiumcarstz",
  facebook_link: "https://www.facebook.com/premiumcarstz",
  tiktok_value: "@premiumcarstz",
  tiktok_link: "https://www.tiktok.com/@premiumcarstz",
  email_value: "contact@premiumcarstz.com",
  email_link: "mailto:contact@premiumcarstz.com",
  phone_value: "+92 300 1112233",
  phone_link: "tel:+923001112233"
}

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

const initializeCatalog = () => {
  if (!localStorage.getItem(CARS_KEY)) {
    localStorage.setItem(CARS_KEY, JSON.stringify(defaultCars))
  }
}

const initializeContactInfo = () => {
  if (!localStorage.getItem(CONTACT_KEY)) {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(defaultContactInfo))
  }
}

const getCars = () => {
  initializeCatalog()
  try {
    const parsed = JSON.parse(localStorage.getItem(CARS_KEY) || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const setCars = (cars) => localStorage.setItem(CARS_KEY, JSON.stringify(cars))

const saveCar = (car) => {
  const current = getCars()
  current.unshift(car)
  setCars(current)
}

const deleteCar = (id) => {
  const filtered = getCars().filter((car) => car.id !== id)
  setCars(filtered)
}

const getContactInfo = () => {
  initializeContactInfo()
  try {
    const parsed = JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}")
    if (!parsed || typeof parsed !== "object") return { ...defaultContactInfo }
    return { ...defaultContactInfo, ...parsed }
  } catch {
    return { ...defaultContactInfo }
  }
}

const setContactInfo = (info) => localStorage.setItem(CONTACT_KEY, JSON.stringify(info))

const isAdmin = () => localStorage.getItem(ROLE_KEY) === "admin"

const cardTemplate = (car) => `
  <article class="car-card">
    <img src="${car.image_url}" alt="${car.make} ${car.model}" />
    <div class="car-card-body">
      <h3 class="car-title">${car.make} ${car.model} (${car.year})</h3>
      <div class="meta-row">
        <span class="price">${formatPrice(car.price)}</span>
        <span class="badge">${car.fuel}</span>
      </div>
      <a class="btn btn-dark" href="./car.html?id=${car.id}">View Details</a>
    </div>
  </article>
`

const setupMobileMenu = () => {
  const toggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")
  if (!toggle || !navLinks) return
  toggle.addEventListener("click", () => navLinks.classList.toggle("open"))
}

const setupAdminNav = () => {
  const adminLinks = document.querySelectorAll('[data-admin-link="true"]')
  adminLinks.forEach((link) => {
    if (isAdmin()) {
      link.classList.remove("hidden")
    } else {
      link.classList.add("hidden")
    }
  })
}

const renderFeatured = () => {
  const holder = document.getElementById("featured-cars")
  if (!holder) return
  holder.innerHTML = getCars().slice(0, 3).map(cardTemplate).join("")
}

const renderCarsPage = () => {
  const grid = document.getElementById("cars-grid")
  if (!grid) return

  const searchInput = document.getElementById("search-input")
  const fuelFilter = document.getElementById("fuel-filter")
  const sortFilter = document.getElementById("sort-filter")

  const apply = () => {
    let list = [...getCars()]

    const query = (searchInput?.value || "").trim().toLowerCase()
    const fuel = fuelFilter?.value || "all"
    const sort = sortFilter?.value || "default"

    if (query) {
      list = list.filter((c) => `${c.make} ${c.model}`.toLowerCase().includes(query))
    }

    if (fuel !== "all") {
      list = list.filter((c) => c.fuel === fuel)
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price)
    if (sort === "year-desc") list.sort((a, b) => b.year - a.year)

    if (list.length === 0) {
      grid.innerHTML = "<p>No cars matched your filters. Try different options.</p>"
      return
    }

    grid.innerHTML = list.map(cardTemplate).join("")
  }

  searchInput?.addEventListener("input", apply)
  fuelFilter?.addEventListener("change", apply)
  sortFilter?.addEventListener("change", apply)

  apply()
}

const renderDetailPage = () => {
  const root = document.getElementById("car-detail")
  if (!root) return

  const id = Number(new URLSearchParams(window.location.search).get("id"))
  const car = getCars().find((item) => item.id === id)

  if (!car) {
    root.innerHTML = '<div class="detail-body"><h1>Car not found</h1><p>This listing may have been removed.</p><a class="btn btn-dark" href="./cars.html">Back to inventory</a></div>'
    return
  }

  root.innerHTML = `
    <img src="${car.image_url}" alt="${car.make} ${car.model}" />
    <div class="detail-body">
      <h1>${car.make} ${car.model} (${car.year})</h1>
      <p class="price" style="font-size:1.25rem">${formatPrice(car.price)}</p>
      <ul class="detail-points">
        <li><strong>Fuel:</strong> ${car.fuel}</li>
        <li><strong>Year:</strong> ${car.year}</li>
        <li><strong>Listing ID:</strong> ${car.id}</li>
      </ul>
      <p>${car.description || "No extra description provided."}</p>
      <button id="inquiry-btn" class="btn btn-accent">Send Inquiry</button>
    </div>
  `

  document.getElementById("inquiry-btn")?.addEventListener("click", () => {
    alert("Inquiry sent. Seller will contact you soon.")
  })
}

const setupSellForm = () => {
  const form = document.getElementById("sell-form")
  if (!form) return

  if (!isAdmin()) {
    const shell = document.querySelector(".form-shell")
    if (shell) {
      shell.innerHTML = `
        <h1>Admin Access Required</h1>
        <p>Only admin accounts can add new car listings.</p>
        <a class="btn btn-dark" href="./auth.html#login">Login as Admin</a>
      `
    }
    return
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData(form)

    const payload = {
      id: Date.now(),
      make: String(formData.get("make") || "").trim(),
      model: String(formData.get("model") || "").trim(),
      year: Number(formData.get("year")),
      price: Number(formData.get("price")),
      fuel: String(formData.get("fuel") || "").trim(),
      image_url: String(formData.get("image_url") || "").trim(),
      description: String(formData.get("description") || "").trim()
    }

    if (!payload.make || !payload.model || !payload.image_url || !payload.fuel || !payload.description) return

    saveCar(payload)
    const note = document.createElement("p")
    note.className = "notice"
    note.textContent = "Listing published successfully. Redirecting to marketplace..."
    form.appendChild(note)

    setTimeout(() => {
      window.location.href = "./cars.html"
    }, 900)
  })
}

const setupAuthPage = () => {
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  if (!loginForm || !registerForm) return

  const tabLogin = document.getElementById("tab-login")
  const tabRegister = document.getElementById("tab-register")

  const syncTab = () => {
    const hash = window.location.hash === "#register" ? "register" : "login"
    const registerMode = hash === "register"

    registerForm.classList.toggle("hidden", !registerMode)
    loginForm.classList.toggle("hidden", registerMode)
    tabRegister?.classList.toggle("active", registerMode)
    tabLogin?.classList.toggle("active", !registerMode)
  }

  syncTab()
  window.addEventListener("hashchange", syncTab)

  const addSuccess = (form, text) => {
    const existing = form.querySelector(".notice")
    if (existing) existing.remove()
    const note = document.createElement("p")
    note.className = "notice"
    note.textContent = text
    form.appendChild(note)
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(loginForm)
    const email = String(formData.get("email") || "").trim().toLowerCase()
    const password = String(formData.get("password") || "")

    const isValidAdmin = ADMIN_ACCOUNTS.some((account) => account.email === email && account.password === password)

    if (isValidAdmin) {
      localStorage.setItem(ROLE_KEY, "admin")
      addSuccess(loginForm, "Admin login successful. Redirecting to admin panel...")
      setTimeout(() => {
        window.location.href = "./admin.html"
      }, 800)
      return
    }

    localStorage.setItem(ROLE_KEY, "user")
    addSuccess(loginForm, "User login successful (demo).")
  })

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    localStorage.setItem(ROLE_KEY, "user")
    addSuccess(registerForm, "Account created (demo).")
  })
}

const renderContactPage = () => {
  const grid = document.getElementById("contact-grid")
  if (!grid) return

  const info = getContactInfo()

  grid.innerHTML = CONTACT_ITEMS.map((item) => {
    const value = escapeHtml(info[`${item.key}_value`])
    const link = escapeHtml(info[`${item.key}_link`])
    const attrs = item.newTab ? ' target="_blank" rel="noreferrer"' : ""

    return `
      <a class="contact-card" href="${link}"${attrs}>
        <div class="social-row">
          <img class="social-icon" src="${item.icon}" alt="${item.label}" />
          <span class="contact-label">${item.label}</span>
        </div>
        <span class="contact-value">${value}</span>
      </a>
    `
  }).join("")
}

const setupAdminPage = () => {
  const panel = document.getElementById("admin-panel")
  if (!panel) return

  if (!isAdmin()) {
    panel.innerHTML = '<p class="notice">Admin access required. Please login with admin account.</p><a class="btn btn-dark" href="./auth.html#login">Go to login</a>'
    return
  }

  const cars = getCars()
  const contact = getContactInfo()

  panel.innerHTML = `
    <div class="admin-layout">
      <section class="admin-block">
        <div class="admin-actions">
          <h2>Admin Controls</h2>
          <button id="admin-logout" class="btn btn-light" type="button">Logout Admin</button>
        </div>
        <p class="demo-note">Only these 3 admin accounts can access admin mode.</p>
      </section>

      <section class="admin-block">
        <h2>Contact Page Settings</h2>
        <form id="contact-form" class="form-grid">
          ${CONTACT_ITEMS.map(
            (item) => `
              <div class="admin-contact-row">
                <label class="field-label" for="${item.key}-value">${item.label} Display Text</label>
                <input id="${item.key}-value" name="${item.key}_value" type="text" value="${escapeHtml(contact[`${item.key}_value`])}" required />
                <label class="field-label" for="${item.key}-link">${item.label} Link</label>
                <input id="${item.key}-link" name="${item.key}_link" type="text" value="${escapeHtml(contact[`${item.key}_link`])}" required />
              </div>
            `
          ).join("")}
          <button class="btn btn-dark" type="submit">Save Contact Details</button>
        </form>
      </section>

      <section class="admin-block">
        <h2>Manage Car Listings (${cars.length})</h2>
        ${cars.length === 0 ? "<p>No listings available.</p>" : ""}
        <div class="card-grid">
          ${cars
            .map(
              (car) => `
                <article class="car-card">
                  <img src="${car.image_url}" alt="${car.make} ${car.model}" />
                  <div class="car-card-body">
                    <h3 class="car-title">${car.make} ${car.model} (${car.year})</h3>
                    <div class="meta-row">
                      <span class="price">${formatPrice(car.price)}</span>
                      <span class="badge">${car.fuel}</span>
                    </div>
                    <button class="btn btn-accent" data-delete-id="${car.id}">Delete Listing</button>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    </div>
  `

  const contactForm = document.getElementById("contact-form")
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData(contactForm)
    const updated = {}

    CONTACT_ITEMS.forEach((item) => {
      const valueKey = `${item.key}_value`
      const linkKey = `${item.key}_link`
      const value = String(formData.get(valueKey) || "").trim()
      const link = String(formData.get(linkKey) || "").trim()

      updated[valueKey] = value || defaultContactInfo[valueKey]
      updated[linkKey] = link || defaultContactInfo[linkKey]
    })

    setContactInfo(updated)

    const existing = contactForm.querySelector(".notice")
    if (existing) existing.remove()
    const note = document.createElement("p")
    note.className = "notice"
    note.textContent = "Contact details updated successfully."
    contactForm.appendChild(note)
  })

  panel.querySelectorAll("[data-delete-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-delete-id"))
      deleteCar(id)
      setupAdminPage()
    })
  })

  document.getElementById("admin-logout")?.addEventListener("click", () => {
    localStorage.removeItem(ROLE_KEY)
    window.location.href = "./index.html"
  })
}

initializeCatalog()
initializeContactInfo()
setupMobileMenu()
setupAdminNav()
renderFeatured()
renderCarsPage()
renderDetailPage()
setupSellForm()
setupAuthPage()
renderContactPage()
setupAdminPage()

/* =========================
   LEVEL 2 FEATURES
========================= */

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
let compareList = []

const saveFavorites = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites))
}

const toggleFavorite = (id) => {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id)
  } else {
    favorites.push(id)
  }
  saveFavorites()
  renderFeatured()
}

const toggleCompare = (id) => {
  if (compareList.includes(id)) {
    compareList = compareList.filter(c => c !== id)
  } else {
    if (compareList.length < 3) compareList.push(id)
  }
  renderFeatured()
}

/* =========================
   UPDATED CARD TEMPLATE
========================= */

const cardTemplateV2 = (car) => `
  <article class="car-card">

    <img src="${car.image_url}" alt="${car.make}" />

    <div class="car-card-body">

      <h3 class="car-title">${car.make} ${car.model}</h3>

      <div class="meta-row">
        <span class="price">$${car.price}</span>
        <span class="badge">${car.fuel}</span>
      </div>

      <div class="card-actions">
        <a class="btn btn-dark" href="./car.html?id=${car.id}">View</a>

        <button class="btn btn-light" onclick="toggleFavorite(${car.id})">
          ${favorites.includes(car.id) ? "💔 Remove" : "❤️ Save"}
        </button>

        <button class="btn btn-light" onclick="toggleCompare(${car.id})">
          ${compareList.includes(car.id) ? "✔ Added" : "⚖ Compare"}
        </button>
      </div>

    </div>
  </article>
`

/* =========================
   FEATURED RENDER (LEVEL 2)
========================= */

const renderFeaturedV2 = () => {
  const holder = document.getElementById("featured-cars")
  if (!holder) return

  let cars = getCars()

  const search = document.getElementById("search-input")?.value?.toLowerCase() || ""
  const fuel = document.getElementById("fuel-filter")?.value || "all"
  const sort = document.getElementById("sort-filter")?.value || "default"

  if (search) {
    cars = cars.filter(c =>
      (c.make + " " + c.model).toLowerCase().includes(search)
    )
  }

  if (fuel !== "all") {
    cars = cars.filter(c => c.fuel === fuel)
  }

  if (sort === "price-asc") cars.sort((a,b)=>a.price-b.price)
  if (sort === "price-desc") cars.sort((a,b)=>b.price-a.price)
  if (sort === "year-desc") cars.sort((a,b)=>b.year-a.year)

  holder.innerHTML = cars.slice(0, 6).map(cardTemplateV2).join("")
}

/* =========================
   EVENTS
========================= */

document.addEventListener("input", (e) => {
  if (
    e.target.id === "search-input" ||
    e.target.id === "fuel-filter" ||
    e.target.id === "sort-filter"
  ) {
    renderFeaturedV2()
  }
})

document.getElementById("clear-filters")?.addEventListener("click", () => {
  document.getElementById("search-input").value = ""
  document.getElementById("fuel-filter").value = "all"
  document.getElementById("sort-filter").value = "default"
  renderFeaturedV2()
})

document.getElementById("view-favorites")?.addEventListener("click", () => {
  const cars = getCars().filter(c => favorites.includes(c.id))
  document.getElementById("featured-cars").innerHTML =
    cars.map(cardTemplateV2).join("") || "<p>No favorites yet.</p>"
})

document.getElementById("view-compare")?.addEventListener("click", () => {
  const cars = getCars().filter(c => compareList.includes(c.id))
  document.getElementById("featured-cars").innerHTML =
    cars.map(cardTemplateV2).join("") || "<p>Select cars to compare.</p>"
})

/* replace old render */
renderFeatured = renderFeaturedV2
