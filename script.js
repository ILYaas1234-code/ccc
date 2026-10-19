// simple student-style JS: show/hide views, calendar, small forms

const yearEl = document.getElementById("year");
const navLinksWrap = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");
const navItems = document.querySelectorAll("[data-view]");
const jumpButtons = document.querySelectorAll("[data-view-link]");
const views = document.querySelectorAll(".view");

yearEl.textContent = new Date().getFullYear();

function showView(name) {
  views.forEach((v) => {
    v.classList.toggle("active", v.id === "view-" + name);
  });
  navItems.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("data-view") === name);
  });
}

navItems.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = a.getAttribute("data-view");
    showView(target);
    navLinksWrap.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

jumpButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const to = btn.getAttribute("data-view-link");
    showView(to);
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinksWrap.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// contact form validation
(function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const success = document.getElementById("contactSuccess");
  const name = document.getElementById("cName");
  const email = document.getElementById("cEmail");
  const msg = document.getElementById("cMsg");

  function setErr(key, text) {
    const el = form.querySelector('[data-err="' + key + '"]');
    if (el) el.textContent = text || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    success.textContent = "";
    setErr("name", "");
    setErr("email", "");
    setErr("message", "");

    let ok = true;
    const n = name.value.trim();
    const em = email.value.trim();
    const m = msg.value.trim();

    if (n.length < 2) {
      setErr("name", "Please enter your name.");
      ok = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(em)) {
      setErr("email", "Please enter a valid email.");
      ok = false;
    }
    if (m.length < 10) {
      setErr("message", "Message should be at least 10 characters.");
      ok = false;
    }

    if (!ok) return;
    form.reset();
    success.textContent = "Success! Your message was checked (no backend is connected).";
  });
})();

// help center
(function setupHelpCenter() {
  const form = document.getElementById("helpForm");
  if (!form) return;
  const name = document.getElementById("hName");
  const msg = document.getElementById("hMsg");

  function setErr(key, text) {
    const el = form.querySelector('[data-err="' + key + '"]');
    if (el) el.textContent = text || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setErr("hname", "");
    setErr("hmsg", "");
    setErr("send", "");

    const n = name.value.trim();
    const m = msg.value.trim();
    const option = (new FormData(form).get("send") || "").toString();

    let ok = true;
    if (n.length < 2) {
      setErr("hname", "Please enter your name.");
      ok = false;
    }
    if (m.length < 10) {
      setErr("hmsg", "Message should be at least 10 characters.");
      ok = false;
    }
    if (option !== "wa" && option !== "mail") {
      setErr("send", "Choose WhatsApp or Gmail.");
      ok = false;
    }
    if (!ok) return;

    const text = "Name: " + n + "\n\nComplaint:\n" + m;
    if (option === "wa") {
      const url = "https://wa.me/252770767090?text=" + encodeURIComponent(text);
      window.open(url, "_blank");
    } else {
      const subject = "Help Center Ticket";
      const url =
        "mailto:ilyaasyaxye11@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(text);
      window.open(url, "_blank");
    }
  });
})();

// calendar (service view)
(function setupCalendar() {
  const monthEl = document.getElementById("calMonth");
  const yearElCal = document.getElementById("calYear");
  const grid = document.getElementById("calGrid");
  const prevBtn = document.getElementById("calPrev");
  const nextBtn = document.getElementById("calNext");
  const eventDateLabel = document.getElementById("eventDateLabel");
  const eventText = document.getElementById("eventText");
  const saveEvent = document.getElementById("saveEvent");
  const deleteEvent = document.getElementById("deleteEvent");
  const eventStatus = document.getElementById("eventStatus");

  if (!monthEl || !grid) return;

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let events = {};

  try {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) events = JSON.parse(stored);
  } catch (e) {
    events = {};
  }

  function keyForDate(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function updateEventPanel() {
    const k = keyForDate(selectedDate);
    const text = events[k] || "";
    eventText.value = text;
    if (text) {
      eventStatus.textContent = "Saved event: \"" + text + "\"";
    } else {
      eventStatus.textContent = "No event saved for this day yet.";
    }
    eventDateLabel.textContent = selectedDate.toDateString();
  }

  function renderCalendar() {
    const first = new Date(currentYear, currentMonth, 1);
    const last = new Date(currentYear, currentMonth + 1, 0);

    const monthName = first.toLocaleString("default", { month: "long" });
    monthEl.textContent = monthName;
    yearElCal.textContent = String(currentYear);

    grid.innerHTML = "";

    const startDay = first.getDay(); // 0 (Sun) - 6 (Sat)
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement("div");
      grid.appendChild(empty);
    }

    for (let d = 1; d <= last.getDate(); d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cal-day";

      const span = document.createElement("span");
      span.textContent = String(d);
      cell.appendChild(span);

      const k = keyForDate(dateObj);
      if (events[k]) {
        cell.classList.add("has-event");
      }
      const isToday =
        dateObj.getFullYear() === today.getFullYear() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getDate() === today.getDate();
      if (isToday) cell.classList.add("today");

      const isSelected =
        dateObj.getFullYear() === selectedDate.getFullYear() &&
        dateObj.getMonth() === selectedDate.getMonth() &&
        dateObj.getDate() === selectedDate.getDate();
      if (isSelected) cell.classList.add("selected");

      cell.addEventListener("click", function () {
        selectedDate = dateObj;
        updateEventPanel();
        renderCalendar();
      });

      grid.appendChild(cell);
    }

    updateEventPanel();
  }

  prevBtn.addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  nextBtn.addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  saveEvent.addEventListener("click", function () {
    const text = eventText.value.trim();
    const k = keyForDate(selectedDate);
    if (text) {
      events[k] = text;
      eventStatus.textContent = "Event saved for this day.";
    } else {
      delete events[k];
      eventStatus.textContent = "Empty text. Event removed.";
    }
    try {
      localStorage.setItem("calendarEvents", JSON.stringify(events));
    } catch (e) {}
    renderCalendar();
  });

  deleteEvent.addEventListener("click", function () {
    const k = keyForDate(selectedDate);
    if (events[k]) {
      delete events[k];
      eventText.value = "";
      eventStatus.textContent = "Event deleted.";
      try {
        localStorage.setItem("calendarEvents", JSON.stringify(events));
      } catch (e) {}
      renderCalendar();
    } else {
      eventStatus.textContent = "There is no event to delete for this day.";
    }
  });

  renderCalendar();
})();

// start on home view
showView("home");

