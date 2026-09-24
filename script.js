document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Hamburger cho Mobile
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

    // 2. Dark / Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Kiểm tra local storage
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // 3. Đếm ký tự trong Form Liên Hệ & Validate nhiều điều kiện
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const maxLength = 500;

    messageInput.addEventListener('input', () => {
        const currentLength = messageInput.value.length;
        charCount.textContent = `${currentLength}/${maxLength} ký tự`;
        if (currentLength > maxLength) {
            messageInput.value = messageInput.value.substring(0, maxLength);
            charCount.textContent = `${maxLength}/${maxLength} ký tự`;
        }
    });

    // Validate Form
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate Họ tên
        if (nameInput.value.trim() === '') {
            setError(nameInput, nameError, 'Họ tên không được để trống');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            setError(nameInput, nameError, 'Họ tên phải có ít nhất 2 ký tự');
            isValid = false;
        } else {
            setSuccess(nameInput, nameError);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            setError(emailInput, emailError, 'Email không được để trống');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            setError(emailInput, emailError, 'Email không hợp lệ (VD: example@domain.com)');
            isValid = false;
        } else {
            setSuccess(emailInput, emailError);
        }

        // Validate Lời nhắn
        if (messageInput.value.trim() === '') {
            setError(messageInput, messageError, 'Lời nhắn không được để trống');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            setError(messageInput, messageError, 'Lời nhắn phải có ít nhất 10 ký tự');
            isValid = false;
        } else {
            setSuccess(messageInput, messageError);
        }

        if (isValid) {
            formSuccess.classList.remove('hidden');
            contactForm.reset();
            charCount.textContent = `0/${maxLength} ký tự`;
            setTimeout(() => {
                formSuccess.classList.add('hidden');
                clearValidation([nameInput, emailInput, messageInput]);
            }, 5000);
        }
    });

    function setError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
    }

    function setSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
    }

    function clearValidation(inputs) {
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
    }

    // 4. Lọc và Tìm kiếm Dự án
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const noProjectFound = document.getElementById('no-project-found');

    let currentCategory = 'all';
    let searchQuery = '';

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterProjects();
    });

    function filterProjects() {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const tags = card.getAttribute('data-tags');
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = (title.includes(searchQuery) || desc.includes(searchQuery) || tags.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noProjectFound.classList.remove('hidden');
        } else {
            noProjectFound.classList.add('hidden');
        }
    }

    // 5. Hiển thị năm hiện tại ở Footer
    const currentYearSpan = document.getElementById('current-year');
    currentYearSpan.textContent = new Date().getFullYear();

    // 6. Scroll Reveal Animation (Hiệu ứng xuất hiện khi cuộn)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Kiểm tra ngay khi tải trang
});
