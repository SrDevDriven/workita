document
  .querySelector(".book-submit-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Get the reCAPTCHA response
    const recaptchaResponse = grecaptcha.getResponse();

    if (recaptchaResponse) {
      // Collect form data
      const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        companyName: document.getElementById("companyName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        jobTitle: document.getElementById("jobTitle").value,
        howDidYouHear: document.getElementById("howDidYouHear").value,
        recaptchaResponse: recaptchaResponse,
      };

      // Send reCAPTCHA response to backend for verification
      fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: "6LcJUxorAAAAAN0pKi3i7B9wwlFs5a5ZtCdiobFB", // Replace with your secret key
          response: recaptchaResponse,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // reCAPTCHA verification passed, now submit the form data to backend
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
                  alert("Form submitted successfully!");
                  $("#myModal").modal("hide"); // Hide the modal after successful submission
                } else {
                  alert("Form submission failed!");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
              });
          } else {
            alert("reCAPTCHA verification failed!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("reCAPTCHA verification failed!");
        });
    } else {
      alert("Please complete the reCAPTCHA!");
    }
  });
