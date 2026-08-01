// ══ JPP PMKL STUDENT PORTAL - APP MODULE ══

// ── Photo Album Lightbox ──
    const albumPhotos = [
      { src: 'albums/jpp.jpeg', caption: 'JPP PMKL' },
      { src: 'albums/convo.JPG', caption: 'Convocation' },
      { src: 'albums/futsal.JPG', caption: 'Futsal' },
      { src: 'albums/esport.JPG', caption: 'E-Sport' },
      { src: 'albums/ihya.jpg', caption: 'Ihya Ramadan' },
      { src: 'albums/mg.JPG', caption: 'Graduation Ceremony' },
      { src: 'albums/mts.JPG', caption: 'Mid-Semester Dinner' },
      { src: 'albums/bubur.JPG', caption: 'Community Programme' },
    ];
    let currentLightboxIdx = 0;

    function openLightbox(idx) {
      currentLightboxIdx = idx;
      const photo = albumPhotos[idx];
      document.getElementById('lightboxImg').src = photo.src;
      document.getElementById('lightboxImg').alt = photo.caption;
      document.getElementById('lightboxCaption').textContent = photo.caption + '  (' + (idx + 1) + ' / ' + albumPhotos.length + ')';
      document.getElementById('lightboxOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      document.getElementById('lightboxOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }

    function closeLightboxOnBg(e) {
      if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
    }

    function lightboxNav(dir) {
      currentLightboxIdx = (currentLightboxIdx + dir + albumPhotos.length) % albumPhotos.length;
      const photo = albumPhotos[currentLightboxIdx];
      const img = document.getElementById('lightboxImg');
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = photo.src;
        img.alt = photo.caption;
        img.style.opacity = '1';
        document.getElementById('lightboxCaption').textContent = photo.caption + '  (' + (currentLightboxIdx + 1) + ' / ' + albumPhotos.length + ')';
      }, 150);
    }

    document.addEventListener('keydown', function (e) {
      const lb = document.getElementById('lightboxOverlay');
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxNav(1);
      if (e.key === 'ArrowLeft') lightboxNav(-1);
    });
    // Lightbox img transition is now defined in CSS (#lightboxImg)

    // ── Navigation ──
    function navigate(section) {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

      const el = document.getElementById(section);
      if (el) el.classList.add('active');

      const lnk = document.querySelector(`.nav-link[data-section="${section}"]`);
      if (lnk) lnk.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (document.getElementById('navLinks').classList.contains('open')) {
        document.getElementById('navLinks').classList.remove('open');
      }

      // Auto reset rental sub-grid levels when clicking away and returning to 'rent' tab
      if (section === 'rent') {
        showRentHome();
      }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navigate(this.dataset.section);
      });
    });

    // Mobile nav toggle
    document.getElementById('navHamburger').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });

    // ── Theme toggle ──
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // ── Clock ──
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      document.getElementById('dashClock').textContent = `${h}:${m}:${s}`;
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      document.getElementById('dashDay').textContent = days[now.getDay()];
      document.getElementById('dashDateStr').textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ── Calendar ──
    function buildCalendar() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const today = now.getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const wd = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      document.getElementById('calMonthYear').textContent = `${monthNames[month]} ${year}`;
      const grid = document.getElementById('calGrid');
      grid.innerHTML = '';
      wd.forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-wd';
        el.textContent = d;
        grid.appendChild(el);
      });
      for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day empty';
        grid.appendChild(el);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const el = document.createElement('div');
        el.className = 'cal-day' + (d === today ? ' today' : '');
        el.textContent = d;
        grid.appendChild(el);
      }
    }
    buildCalendar();

    // Re-run calendar at midnight so "today" stays accurate if page is left open
    (function scheduleMidnightCalendarRefresh() {
      const now = new Date();
      const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
      setTimeout(function () {
        buildCalendar();
        scheduleMidnightCalendarRefresh(); // Reschedule for next midnight
      }, msUntilMidnight);
    })();

    // ── Stats counter animation ──
    function animateCount(el, target) {
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        if (target >= 1000) {
          el.textContent = Math.floor(current / 1000) + 'K+';
        } else {
          el.textContent = Math.floor(current) + (target > 10 ? '+' : '');
        }
        if (current >= target) clearInterval(interval);
      }, 16);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el, parseInt(el.dataset.count));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));

    // ── Rent House Application Logic Flow ──
    let currentApartmentSelection = "";
    let currentBlockSelection = "";

    function showRentHome() {
      document.getElementById('rentApartmentGrid').style.display = 'grid';
      document.getElementById('rentBlockGrid').style.display = 'none';
      document.getElementById('rentUnitGrid').style.display = 'none';
      document.getElementById('rentNavHeader').style.display = 'none';
      document.getElementById('rentFeaturesSection').style.display = 'block';
      document.getElementById('rentDivider').style.display = 'block';

      document.getElementById('rentMainTitle').innerText = "Rent House Listings";
      document.getElementById('rentMainSub').innerText = "Select an apartment complex near the polytechnic to view available student accommodation listings.";
    }

    function selectApartment(apartmentName) {
      currentApartmentSelection = apartmentName;
      document.getElementById('rentApartmentGrid').style.display = 'none';
      document.getElementById('rentFeaturesSection').style.display = 'none';
      document.getElementById('rentDivider').style.display = 'none';
      document.getElementById('rentNavHeader').style.display = 'block';

      document.getElementById('rentMainTitle').innerText = apartmentName + " — Select Block";
      document.getElementById('rentMainSub').innerText = "Please select a building block below to view available rental units.";

      const blockGrid = document.getElementById('rentBlockGrid');
      blockGrid.style.display = 'grid';
      blockGrid.innerHTML = ''; // Wipe template contents

      // Dynamically insert 4 structured blocks matching original system styling
      const blocks = ['Blok 1', 'Blok 2', 'Blok 3', 'Blok 4'];
      blocks.forEach((block) => {
        blockGrid.innerHTML += `
            <a class="dash-card" onclick="selectBlock('${block}')" style="--card-color: #1a4bff; --card-color-bg: var(--primary-glow);">
              <div class="dash-card-arrow"><i class="fas fa-arrow-right"></i></div>
              <div class="dash-card-icon"><i class="fas fa-building"></i></div>
              <h4>${block}</h4>
              <p>View available room and house listings in this building.</p>
            </a>
        `;
      });
    }

    function selectBlock(blockName) {
      currentBlockSelection = blockName;
      document.getElementById('rentBlockGrid').style.display = 'none';

      const unitGrid = document.getElementById('rentUnitGrid');
      unitGrid.style.display = 'grid';
      unitGrid.innerHTML = ''; // Flush previous lists

      document.getElementById('rentMainTitle').innerText = `${currentApartmentSelection} — ${blockName}`;
      document.getElementById('rentMainSub').innerText = `Showing available units in ${currentApartmentSelection} (${blockName}).`;

      // Dynamic Mock Database mapping to structure your secondary provided code properties
      let listings = [];

      if (currentApartmentSelection === "Apartment Mahsuri") {
        listings = [
          { unit: 'Unit A-101', price: 'RM 450', details: 'Muslim students only. 2 Bedrooms, 1 Bathroom. Fully furnished. Includes double-decker bed, lockers, refrigerator, kitchen & washing machine.', contact: 'Encik Ahmad (012-328 0168)', address: 'Jalan Setiawangsa 13, Taman Setiawangsa, KL', features: ['WiFi', 'Water Incl.', 'Electric Incl.', '24hr Guarded'] },
          { unit: 'Unit A-102', price: 'RM 470', details: 'Comfortable shared room (Immediate Intake). Fully furnished, 2 Bedrooms & 1 Bathroom. Walking distance to Setiawangsa LRT station.', contact: 'Encik Ahmad (012-328 0168)', address: 'Jalan Setiawangsa 13, Taman Setiawangsa, KL', features: ['WiFi', 'Refrigerator', 'Washing Machine'] },
          { unit: 'Unit A-201', price: 'RM 550', details: 'Spacious 3 Bedrooms & 2 Bathrooms, ideal for student group sharing. Fully furnished with complete furniture.', contact: 'Puan Halima (016-946 3923)', address: 'Jalan Setiawangsa 13, Taman Setiawangsa, KL', features: ['Fully Furnished', 'Sofa', 'Bed'] }
        ];
      } else if (currentApartmentSelection === "Apartment Intan") {
        listings = [
          { unit: 'Unit Intan Premium', price: 'RM 350', details: 'Immediate Student Intake. Affordable rent including full utilities (WiFi, electricity & water cost controlled). Walking distance to shops.', contact: 'En. Zul (012-466 2096)', address: 'Setiawangsa near Politeknik METrO KL', features: ['WiFi incl.', 'Water incl.', 'Electric incl.', 'Near PMKL'] }
        ];
      } else {
        // Fallback default generation for empty categories placeholders
        listings = [
          { unit: 'Unit TBD-Standard Room', price: 'RM 300', details: 'Standard single/shared room near PMKL, available for new semester intake.', contact: 'JPP Portal Management (General Info)', address: 'Setiawangsa, Kuala Lumpur', features: ['Bed', 'Fan'] }
        ];
      }

      // Render cards using premium portal style setup mechanics
      listings.forEach(item => {
        // Build features tags
        let featureChips = '';
        item.features.forEach(f => {
          featureChips += `<div class="feat-chip"><i class="fas fa-check-circle" style="color:var(--gold)"></i> ${f}</div>`;
        });

        unitGrid.innerHTML += `
            <div class="rent-card">
              <div class="rent-price-badge">${item.price}/mo</div>
              <div class="rent-thumb" style="background: var(--surface2); font-size:2.5rem;">🛋️</div>
              <div class="rent-card-body">
                <h4>${item.unit}</h4>
                <p style="font-size:0.85rem; color:var(--text2); margin-bottom:1rem; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical; overflow:hidden;">${item.details}</p>
                <div class="rent-features">${featureChips}</div>
                <button class="btn-rent" onclick="openRentModal('${item.unit}', '${item.address}', '${item.price} / month', '${item.details}', '${item.contact}')">View Details</button>
              </div>
            </div>
        `;
      });
    }

    // ── Rent Modal Handlers ──
    function openRentModal(title, address, price, details, contact) {
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalAddress').textContent = address;
      document.getElementById('modalPrice').textContent = price;
      document.getElementById('modalDetails').textContent = details;
      document.getElementById('modalContact').textContent = contact || 'Contact Property Owner';

      // Set up copy behavior context cleanly
      const copyBtn = document.getElementById('modalCopyBtn');
      copyBtn.onclick = function () {
        navigator.clipboard.writeText(`Property: ${title}\nRent: ${price}\nContact: ${contact}`);
        showToast('Contact details copied!');
        closeRentModal();
      };

      document.getElementById('rentModal').classList.add('open');
    }

    function closeRentModal() {
      document.getElementById('rentModal').classList.remove('open');
    }

    document.getElementById('rentModal').addEventListener('click', function (e) {
      if (e.target === this) closeRentModal();
    });

    // ── Toast System ──
    let toastTimeout;
    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ── Nav shadow configuration adjustments on scroll behavior ──
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('mainNav');
      nav.style.background = window.scrollY > 20
        ? (document.documentElement.getAttribute('data-theme') === 'light'
          ? 'rgba(242,245,252,0.95)' : 'rgba(7,9,15,0.92)')
        : '';
    });

    // ══ MAINTENANCE MODE ══
    const MAINTENANCE_MODE = false;

    function initMaintenanceMode() {
      if (!MAINTENANCE_MODE) return;
      const overlay = document.getElementById('maintenanceOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    initMaintenanceMode();
    document.addEventListener('DOMContentLoaded', initMaintenanceMode);