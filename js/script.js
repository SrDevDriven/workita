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

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      showError("recapture", "Please complete the reCAPTCHA.");
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

      // Verify reCAPTCHA - !! requred to do in backend
      fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: "6LcJUxorAAAAAN0pKi3i7B9wwlFs5a5ZtCdiobFB", //  secret key!
          response: recaptchaResponse,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Submit form to backend
            fetch("https://your-backend-url.com/submit-form", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  console.log("Form submitted successfully!");
                  $("#myModal").modal("hide");
                } else {
                  console.log("Form submission failed!");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                console.log("An error occurred. Please try again.");
              });
          } else {
            console.log("reCAPTCHA verification failed!");
            $("#myModal").modal("hide");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          console.log("reCAPTCHA verification failed!");
          $("#myModal").modal("hide");
        });
    }
  });
