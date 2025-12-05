document.addEventListener('DOMContentLoaded', function() {
  initContactForm();
  initAnimations();
});

function initContactForm() {
  const forms = document.querySelectorAll('.wpcf7-form, .cpw-callback-form form, form[data-contact-form]');
  
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });

  const callbackForm = document.querySelector('.cpw-callback-form');
  if (callbackForm) {
    const form = callbackForm.querySelector('form') || callbackForm;
    if (form.tagName !== 'FORM') {
      const inputs = callbackForm.querySelectorAll('input, select, textarea');
      const submitBtn = callbackForm.querySelector('.cpw-submit-btn, button[type="submit"], input[type="submit"]');
      
      if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
          e.preventDefault();
          handleCallbackFormSubmit(callbackForm, inputs);
        });
      }
    }
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  await submitFormData(form, data);
}

async function handleCallbackFormSubmit(container, inputs) {
  const data = {};
  
  inputs.forEach(input => {
    const name = input.name || input.placeholder?.toLowerCase().replace(/\s+/g, '') || input.id;
    if (name) {
      if (input.tagName === 'SELECT') {
        data[name] = input.options[input.selectedIndex]?.text || input.value;
      } else {
        data[name] = input.value;
      }
    }
  });

  const mappedData = {
    fullName: data.fullname || data.name || data['full-name'] || data['your-name'] || '',
    contactNumber: data.contactnumber || data.phone || data.tel || data['your-tel'] || '',
    city: data.city || data.location || '',
    interestedCourse: data.interestedcourse || data.course || data.select || data['menu-447'] || '',
    message: data.message || data.textarea || ''
  };

  await submitFormData(container, mappedData);
}

async function submitFormData(formElement, data) {
  if (!data.fullName && !data.fullname) {
    showMessage(formElement, 'Please enter your full name', 'error');
    return;
  }
  
  if (!data.contactNumber && !data.contactnumber) {
    showMessage(formElement, 'Please enter your contact number', 'error');
    return;
  }

  formElement.classList.add('form-loading');
  const submitBtn = formElement.querySelector('.cpw-submit-btn, button[type="submit"], input[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = submitBtn.textContent || submitBtn.value;
    if (submitBtn.tagName === 'INPUT') {
      submitBtn.value = 'Submitting...';
    } else {
      submitBtn.textContent = 'Submitting...';
    }
  }

  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      showMessage(formElement, result.message, 'success');
      clearFormInputs(formElement);
    } else {
      showMessage(formElement, result.message || 'Something went wrong', 'error');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showMessage(formElement, 'Network error. Please try again.', 'error');
  } finally {
    formElement.classList.remove('form-loading');
    if (submitBtn) {
      submitBtn.disabled = false;
      if (submitBtn.tagName === 'INPUT') {
        submitBtn.value = submitBtn.dataset.originalText || 'Submit';
      } else {
        submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
      }
    }
  }
}

function showMessage(formElement, message, type) {
  const existingMsg = formElement.querySelector('.form-message');
  if (existingMsg) {
    existingMsg.remove();
  }

  const msgDiv = document.createElement('div');
  msgDiv.className = `form-message form-${type}-message`;
  msgDiv.textContent = message;
  msgDiv.style.marginTop = '15px';

  const submitWrap = formElement.querySelector('.cpw-submit-wrap') || formElement;
  if (submitWrap.querySelector('.cpw-submit-btn')) {
    submitWrap.insertBefore(msgDiv, submitWrap.querySelector('.cpw-submit-btn').nextSibling);
  } else {
    formElement.appendChild(msgDiv);
  }

  if (type === 'success') {
    setTimeout(() => {
      msgDiv.style.opacity = '0';
      msgDiv.style.transition = 'opacity 0.3s ease';
      setTimeout(() => msgDiv.remove(), 300);
    }, 5000);
  } else {
    setTimeout(() => msgDiv.remove(), 4000);
  }
}

function clearFormInputs(formElement) {
  const inputs = formElement.querySelectorAll('input:not([type="submit"]), textarea, select');
  inputs.forEach(input => {
    if (input.tagName === 'SELECT') {
      input.selectedIndex = 0;
    } else {
      input.value = '';
    }
    input.classList.remove('input-error');
  });
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.elementor-invisible, [data-settings*="animation"]'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  const hoverElements = document.querySelectorAll(
    '.elementor-icon-box-wrapper, .cpw-step-card, .elementskit-card, .cpw-tag'
  );

  hoverElements.forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });
}

document.addEventListener('click', function(e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});
