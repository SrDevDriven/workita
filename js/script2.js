document
  .querySelector(".book-submit-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Clear all existing errors
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
    if (companyName === "")
      showError("companyName", "Company name is required.");
    if (!emailRegex.test(email))
      showError("email", "Enter a valid email address.");
    if (!phoneRegex.test(phone))
      showError("phone", "Enter a valid phone number.");
    if (jobTitle === "") showError("jobTitle", "Job title is required.");
    if (howDidYouHear === "")
      showError("howDidYouHear", "This field is required.");

    // Check reCAPTCHA
    let recaptchaResponse = "";
    if (typeof grecaptcha !== "undefined") {
      recaptchaResponse = grecaptcha.getResponse();
    }
    if (!recaptchaResponse) {
      showError("recaptcha", "Please complete the reCAPTCHA.");
    }

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

      // Disable the submit button to prevent multiple submissions
      const submitButton = document.querySelector(".book-submit-btn");
      submitButton.disabled = true;

      fetch(
        "https://worktika-demo-processor-452223930976.us-central1.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.error("Error:", response.status);
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          // Handle success response
          console.log("Success:", data);
          alert("Form submitted successfully!");
        })
        .finally(() => {
          // Re-enable the submit button
          submitButton.disabled = false;
        });
    }
  });
