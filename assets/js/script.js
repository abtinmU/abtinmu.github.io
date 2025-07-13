'use strict';

// element toggle function with animation
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
  elem.classList.add('fancy-animation');
  setTimeout(() => elem.classList.remove('fancy-animation'), 300);
}

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
  sidebarBtn.classList.toggle("active-btn");
});


// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
testimonialsItem.forEach(item => {
  item.addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
});

// add click event to modal close button and overlay
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
selectItems.forEach(item => {
  item.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  filterItems.forEach(item => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
formInputs.forEach(input => {
  input.addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    pages.forEach(page => {
      if (this.innerHTML.toLowerCase() === page.dataset.page) {
        page.classList.add("active");
        link.classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
        link.classList.remove("active");
      }
    });
  });
});

// Adding fancy hover effect to buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mouseover', () => button.classList.add('fancy-hover'));
  button.addEventListener('mouseout', () => button.classList.remove('fancy-hover'));
});

// Adding smooth scroll to page transitions
document.querySelectorAll('[data-nav-link]').forEach(navLink => {
  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = document.querySelector(`#${e.target.innerHTML.toLowerCase()}`);
    targetPage.scrollIntoView({ behavior: 'smooth' });
  });
});


// JavaScript to zoom out the page
document.addEventListener("DOMContentLoaded", function() {
  document.body.style.zoom = "0.82";
});


document.addEventListener("DOMContentLoaded", function() {
  const navbarLinks = document.querySelectorAll(".navbar-link");

  navbarLinks.forEach(link => {
    link.addEventListener("click", function() {
      // Remove the active class from all navbar links
      navbarLinks.forEach(navLink => navLink.classList.remove("active"));

      // Add the active class to the clicked link
      this.classList.add("active");
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const inputs = form.querySelectorAll('[data-form-input]');
  const submitButton = form.querySelector('[data-form-btn]');
  const titleInput = document.getElementById('title');
  const emailInput = form.querySelector('input[name="email"]');
  const nameInput = form.querySelector('input[name="fullname"]');
  const messageInput = form.querySelector('textarea[name="message"]');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      let allFilled = true;
      inputs.forEach(input => {
        if (!input.value) {
          allFilled = false;
        }
      });
      submitButton.disabled = !allFilled;
    });
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Create a new FormData object
    const formData = new FormData();

    // Append fields in the desired order
    formData.append('subject', `New message: ${titleInput.value}`);
    formData.append('fullname', nameInput.value);
    formData.append('email', emailInput.value);
    formData.append('message', messageInput.value);

    // Submit the form data via Fetch
    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        alert('Your message has been sent!');
        form.reset();
        submitButton.disabled = true;
      } else {
        return response.json().then(data => {
          alert('There was a problem with your submission: ' + data.error);
        });
      }
    }).catch(error => {
      alert('There was a problem with your submission.');
    });
  });
});
