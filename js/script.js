const openBookPopupBtn = document.querySelectorAll(".book-btn");
const bookBtn = document.querySelector(".book-submit-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const tryAgainBtn = document.querySelector(".try-again-btn");

openBookPopupBtn.forEach((each) =>
  each.addEventListener("click", function () {
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("failMessage").style.display = "none";

    document.getElementById("demoForm").style.display = "block";
    document.querySelector(".g-recaptcha").style.display = "block";

    document
      .querySelectorAll("#demoForm input, #demoForm textarea")
      .forEach((input) => {
        input.value = "";
      });

    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset();
    }

    document.querySelectorAll(".invalid-feedback").forEach((el) => {
      el.textContent = "";
    });

    document.querySelector(".book-submit-btn").style.display = "inline-block";
    document.querySelector(".try-again-btn").style.display = "none";

    const cancelBtn = document.querySelector(".cancel-btn");
    cancelBtn.textContent = "Cancel";
  })
);

tryAgainBtn.addEventListener("click", function () {
  document.getElementById("failMessage").style.display = "none";

  document.getElementById("demoForm").style.display = "block";
  document.querySelector(".g-recaptcha").style.display = "block";

  document.querySelector(".book-submit-btn").style.display = "inline-block";
  tryAgainBtn.style.display = "none";

  cancelBtn.textContent = "Cancel";
});

bookBtn.addEventListener("click", function (event) {
  event.preventDefault();

  document
    .querySelectorAll(".invalid-feedback")
    .forEach((el) => (el.textContent = ""));

  let isValid = true;

  function showError(id, message) {
    const errorEl = document.getElementById(id + "Error");
    if (errorEl) {
      errorEl.textContent = message;
    }
    isValid = false;
  }

  // Get input values
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const howDidYouHear = document.getElementById("howDidYouHear").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s()+-]+$/;

  // Validate fields
  if (firstName === "") showError("firstName", "First name is required.");
  if (lastName === "") showError("lastName", "Last name is required.");
  if (companyName === "") showError("companyName", "Company name is required.");
  if (!emailRegex.test(email))
    showError("email", "Enter a valid email address.");
  if (!phoneRegex.test(phone))
    showError("phone", "Enter a valid phone number.");
  if (jobTitle === "") showError("jobTitle", "Job title is required.");
  if (howDidYouHear === "")
    showError("howDidYouHear", "This field is required.");

  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    showError("recapture", "Please complete the reCAPTCHA.");
    return;
  }

  const formData = {
    firstName,
    lastName,
    companyName,
    email,
    phone,
    jobTitle,
    howDidYouHear,
  };
  if (isValid) {
    const formData = {
      firstName,
      lastName,
      companyName,
      email,
      phone,
      jobTitle,
      howDidYouHear,
      recaptchaResponse,
    };

    showLoading(bookBtn, "Booking");

    // Submit form to backend
    fetch("https://demo-req.worktika.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("response data", data);
        hideLoading(bookBtn);

        if (data.status === "success") {
          handleSuccess();
        } else {
          handleFail();
        }
      })
      .catch((error) => {
        console.error("Network Error:", error);
        hideLoading(bookBtn);
        handleFail();
      });
  }
});

function showLoading() {
  const overlay = document.getElementById("modalLoadingOverlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
}

function hideLoading() {
  const overlay = document.getElementById("modalLoadingOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

function handleSuccess() {
  document.getElementById("demoForm").style.display = "none";
  document.querySelector(".g-recaptcha").style.display = "none";
  document.getElementById("successMessage").style.display = "block";

  document.querySelector(".book-submit-btn").style.display = "none";

  const cancelBtn = document.querySelector(".cancel-btn");
  cancelBtn.textContent = "Close";
}

function handleFail() {
  document.getElementById("demoForm").style.display = "none";
  document.querySelector(".g-recaptcha").style.display = "none";
  document.getElementById("failMessage").style.display = "block";

  document.querySelector(".book-submit-btn").style.display = "none";
  document.querySelector(".try-again-btn").style.display = "inline-block";

  const cancelBtn = document.querySelector(".cancel-btn");
  cancelBtn.textContent = "Close";
}
