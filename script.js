/**
 * Govindanand Adarsh Vidya Mandir School Website
 * Core Client-side Scripts
 */

document.addEventListener('DOMContentLoaded', function () {
  // --- AOS Initialization ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  // --- Sticky Navbar Transition ---
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Dark Mode Controller ---
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme state
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcon(true);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      updateThemeIcon(false);
    }

    // Click handler
    themeToggleBtn.addEventListener('click', function () {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
      }
    });
  }

  function updateThemeIcon(isDark) {
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (isDark) {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }
  }

  // --- Image Lightbox Modal ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg) {
    // Open Lightbox
    const triggerElements = document.querySelectorAll('[data-lightbox]');
    triggerElements.forEach(elem => {
      elem.addEventListener('click', function (e) {
        e.preventDefault();
        const src = this.getAttribute('data-lightbox') || this.querySelector('img').getAttribute('src');
        const caption = this.getAttribute('data-caption') || this.querySelector('img').getAttribute('alt') || '';
        
        lightboxImg.setAttribute('src', src);
        lightboxCaption.textContent = caption;
        
        lightboxModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    });

    // Close Lightbox
    const closeLightbox = function () {
      lightboxModal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
        lightboxCaption.textContent = '';
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Close on Escape Key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
        closeLightbox();
      }
    });
  }

  // --- Gallery Categories Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        // Toggle Active Button
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --- Dynamic Alumni Directory State & Management ---
  // In-memory array of real/distinguished alumni
  // Pre-seeded: Website Creator — Batch 2022
  const alumniList = [
    {
      name: "Website Creator",
      batch: "2022",
      classPassed: "Class 10",
      profession: "B.Tech Student — Chemical Engineering",
      company: "IIT Roorkee",
      city: "Roorkee",
      state: "Uttarakhand",
      achievements: "Cracked JEE and secured a seat at IIT Roorkee for Chemical Engineering after completing 12 years (LKG–Class 10) at GAVM. Also designed and built this school website as a tribute to his alma mater.",
      avatarInitials: "WC",
      avatarUrl: "website_maker.jpeg"
    }
  ];

  // Temp holder for uploaded image URL
  let uploadedPhotoDataUrl = null;

  // Alumni Photo Upload Preview
  const alumniPhotoInput = document.getElementById('alumniPhoto');
  const alumniUploadBox = document.getElementById('uploadBox');
  if (alumniPhotoInput && alumniUploadBox) {
    alumniPhotoInput.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        if (!file.type.match('image.*')) {
          alert('Please select a valid image file (PNG, JPG, or JPEG).');
          this.value = '';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function (e) {
          uploadedPhotoDataUrl = e.target.result;
          alumniUploadBox.innerHTML = `
            <img src="${e.target.result}" style="max-height: 120px; border-radius: 50%; border: 3px solid var(--primary); width: 120px; height: 120px; object-fit: cover;" class="mb-2">
            <p class="text-success mb-0" style="font-size: 0.85rem;"><i class="fas fa-check-circle"></i> ${file.name}</p>
            <p class="text-muted mb-0" style="font-size: 0.75rem;">Click to change photo</p>
          `;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Render directory cards for a selected batch
  const directoryContainer = document.getElementById('alumniDirectoryCards');
  const batchButtons = document.querySelectorAll('.batch-select-btn');
  const directoryNotice = document.getElementById('directorySelectionNotice');

  function renderAlumniForBatch(batch) {
    if (!directoryContainer) return;

    // Filter alumni
    const filtered = alumniList.filter(alumnus => alumnus.batch === batch);

    // Hide selection message
    if (directoryNotice) {
      directoryNotice.style.display = 'none';
    }

    if (filtered.length === 0) {
      directoryContainer.innerHTML = `
        <div class="col-12 text-center py-4" data-aos="fade-up">
          <p class="text-muted"><i class="fas fa-info-circle me-1"></i> No alumni registered for Batch ${batch} yet. Be the first to join!</p>
        </div>
      `;
      return;
    }

    // Render cards
    directoryContainer.innerHTML = filtered.map(alumnus => {
      const avatarHtml = alumnus.avatarUrl 
        ? `<img src="${alumnus.avatarUrl}" alt="${alumnus.name}" class="alumni-avatar">`
        : `<div class="alumni-avatar d-flex align-items-center justify-content-center bg-primary text-white fs-2 mb-3 fw-bold" style="width: 90px; height: 90px; border-radius: 50%; margin: 0 auto;">${alumnus.avatarInitials}</div>`;
      
      return `
        <div class="col-lg-4 col-md-6" data-aos="fade-up">
          <div class="alumni-card">
            ${avatarHtml}
            <h4 class="alumni-name">${alumnus.name}</h4>
            <span class="alumni-title">${alumnus.profession}</span>
            <p class="text-secondary small mb-2"><strong>At:</strong> ${alumnus.company}</p>
            <p class="alumni-quote">"${alumnus.achievements}"</p>
            <hr class="my-3 opacity-25">
            <p class="text-muted small mb-0"><i class="fas fa-map-marker-alt"></i> ${alumnus.city}, ${alumnus.state} | Passed ${alumnus.classPassed}</p>
          </div>
        </div>
      `;
    }).join('');

    // Re-initialize AOS for dynamic content
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Attach event handlers to batch selector buttons
  if (batchButtons.length > 0) {
    batchButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        batchButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const selectedBatch = this.getAttribute('data-batch');
        renderAlumniForBatch(selectedBatch);
      });
    });
  }

  // Alumni Registration Form Submission Handler
  const alumniForm = document.getElementById('alumniRegForm');
  const successAlertContainer = document.getElementById('alumniFormAlert');

  if (alumniForm) {
    alumniForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = alumniForm.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });

      // Email validation
      const emailInput = alumniForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          emailInput.classList.add('is-invalid');
        } else {
          emailInput.classList.remove('is-invalid');
        }
      }

      // Mobile validation (Indian numbers)
      const phoneInput = alumniForm.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value.trim()) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
          isValid = false;
          phoneInput.classList.add('is-invalid');
        } else {
          phoneInput.classList.remove('is-invalid');
        }
      }

      if (!isValid) {
        alert('Please fill out all required fields correctly.');
        return;
      }

      // Extract form fields
      const name = document.getElementById('fullName').value.trim();
      const batch = document.getElementById('passingYear').value;
      const classPassedVal = document.getElementById('classPassed').value;
      const classPassed = classPassedVal === "12" ? "Class 12 (Arts)" : "Class 10";
      const profession = document.getElementById('profession').value.trim();
      const company = document.getElementById('company').value.trim();
      const city = document.getElementById('city').value.trim();
      const state = document.getElementById('state').value.trim();
      const achievements = document.getElementById('achievements').value.trim();

      // Compute Initials
      const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      // Create new alumnus object
      const newAlumnus = {
        name: name,
        batch: batch,
        classPassed: classPassed,
        profession: profession,
        company: company,
        city: city,
        state: state,
        achievements: achievements,
        avatarInitials: initials,
        avatarUrl: uploadedPhotoDataUrl
      };

      // Add to directory array
      alumniList.push(newAlumnus);
      // Send data to Formspree
      fetch(alumniForm.action, {
        method: "POST",
        body: new FormData(alumniForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      // Reset form and photo holder
      alumniForm.reset();
      uploadedPhotoDataUrl = null;
      if (alumniUploadBox) {
        alumniUploadBox.innerHTML = `
          <i class="fas fa-cloud-upload-alt form-upload-icon"></i>
          <h5 class="mb-1">Drag file here or click to upload</h5>
          <p class="text-muted small mb-0">PNG, JPG, or JPEG formats (max 2MB)</p>
          <input type="file" id="alumniPhoto" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
        `;
        // Re-attach photo upload preview listener
        const newPhotoInput = document.getElementById('alumniPhoto');
        newPhotoInput.addEventListener('change', function () {
          const file = this.files[0];
          if (file) {
            if (!file.type.match('image.*')) {
              alert('Please select a valid image file (PNG, JPG, or JPEG).');
              this.value = '';
              return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
              uploadedPhotoDataUrl = e.target.result;
              alumniUploadBox.innerHTML = `
                <img src="${e.target.result}" style="max-height: 120px; border-radius: 50%; border: 3px solid var(--primary); width: 120px; height: 120px; object-fit: cover;" class="mb-2">
                <p class="text-success mb-0" style="font-size: 0.85rem;"><i class="fas fa-check-circle"></i> ${file.name}</p>
                <p class="text-muted mb-0" style="font-size: 0.75rem;">Click to change photo</p>
              `;
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Show alert box
      if (successAlertContainer) {
        successAlertContainer.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Registration successful!</strong> Your name has been dynamically added to our <strong>Batch ${batch}</strong> directory. Select your batch below to view it!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        successAlertContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Find matching batch button, make it active, and render
      const matchingBtn = document.querySelector(`.batch-select-btn[data-batch="${batch}"]`);
      if (matchingBtn) {
        batchButtons.forEach(b => b.classList.remove('active'));
        matchingBtn.classList.add('active');
        renderAlumniForBatch(batch);
      }
    });
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('schoolContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = contactForm.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });

      const emailInput = contactForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          emailInput.classList.add('is-invalid');
        } else {
          emailInput.classList.remove('is-invalid');
        }
      }

      if (!isValid) {
        alert('Please fill out all required fields correctly.');
        return;
      }

      // Mock Success State
      const formWrapper = contactForm.parentElement;
      formWrapper.innerHTML = `
        <div class="text-center py-4" data-aos="fade-up">
          <div class="mb-3" style="font-size: 3rem; color: var(--primary);">
            <i class="fas fa-paper-plane"></i>
          </div>
          <h4 class="mb-2">Message Sent Successfully!</h4>
          <p class="text-muted mb-0">Thank you for contacting us. Our team will get back to you shortly.</p>
          <button class="btn btn-secondary-custom mt-4 btn-sm" onclick="location.reload()">Send Another Message</button>
        </div>
      `;
    });
  }
});
// Google Sheets Integration for Alumni Form
const alumniForm = document.getElementById("alumniRegForm");

if (alumniForm) {
  alumniForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      fullName: document.getElementById("fullName").value,
      fatherName: document.getElementById("fatherName").value,
      mobileNo: document.getElementById("mobileNo").value,
      email: document.getElementById("email").value,
      passingYear: document.getElementById("passingYear").value,
      classPassed: document.getElementById("classPassed").value,
      profession: document.getElementById("profession").value,
      company: document.getElementById("company").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      achievements: document.getElementById("achievements").value,
      message: document.getElementById("message").value
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyl-Oz811nzsvvruOHVR-phvv9Rzdd4SUlbwEF392-7ybcdHsY6B-lnJK7rsuctW8gl/exec",
        {
          method: "POST",
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        alert("🎉 Registration submitted successfully!");
        alumniForm.reset();
      } else {
        alert("❌ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting form.");
    }
  });
}
