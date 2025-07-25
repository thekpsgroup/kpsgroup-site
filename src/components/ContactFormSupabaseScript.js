// Enhanced Contact Form with Supabase Integration
// Update the form submission to use our new API endpoint

// Add this function at the end of the existing script section:
async function submitToSupabase(formData) {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        company: formData.get("company"),
        service_type: formData.get("service") || "general-inquiry",
        message: formData.get("message"),
        location: formData.get("city") || formData.get("location")
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Success handling
      showSuccessMessage("Thank you! Your message has been received and will be reviewed by our team.");
      form.reset();
      return true;
    } else {
      throw new Error(result.error || "Failed to submit form");
    }
  } catch (error) {
    console.error("Form submission error:", error);
    showErrorMessage("There was an error submitting your form. Please try again or contact us directly.");
    return false;
  }
}

// Update the main form submission handler to use Supabase
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(`#contact-form`);
  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitButton = form.querySelector(`button[type="submit"]`);
      
      // Show loading state
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }
      
      // Submit to Supabase
      const success = await submitToSupabase(formData);
      
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
      
      if (success) {
        // Optional: redirect to thank you page
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 2000);
      }
    });
  }
});

function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4";
  successDiv.textContent = message;
  
  const form = document.querySelector(`#contact-form`);
  if (form) {
    form.parentNode.insertBefore(successDiv, form);
    setTimeout(() => successDiv.remove(), 5000);
  }
}

function showErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4";
  errorDiv.textContent = message;
  
  const form = document.querySelector(`#contact-form`);
  if (form) {
    form.parentNode.insertBefore(errorDiv, form);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}
