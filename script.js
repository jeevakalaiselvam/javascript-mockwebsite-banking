"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());

    console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

    console.log(
        "height/width viewport",
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    );

    // Scrolling
    // window.scrollTo(
    //   s1coords.left + window.pageXOffset,
    //   s1coords.top + window.pageYOffset
    // );

    // window.scrollTo({
    //   left: s1coords.left + window.pageXOffset,
    //   top: s1coords.top + window.pageYOffset,
    //   behavior: 'smooth',
    // });

    section1.scrollIntoView({ behavior: "smooth" });
});

//PAGE NAGIVATION USING EVENT DELEGATION
document.querySelector(".nav__links").addEventListener("click", function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains("nav__link")) {
        const id = e.target.getAttribute("href");
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
});

//Tabbed Components
tabsContainer.addEventListener("click", (e) => {
    const clicked = e.target.closest(".operations__tab");
    //Return if container is clicked and nothing inside it is clicked
    if (!clicked) return;

    //Reset active data

    tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
    tabsContent.forEach((tab) =>
        tab.classList.remove("operations__content--active")
    );

    //Make the clicked tab active
    clicked.classList.add("operations__tab--active");

    //Activating content area by using the data attribute
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add("operations__content--active");
});

//Handle Menu Fade
const handleHover = function (e) {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const siblings = link.closest(".nav").querySelectorAll(".nav__link");
        const logo = link.closest(".nav").querySelector("img");

        siblings.forEach((el) => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//Sticky Navigation Logic
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`, //Add extra padding
});
headerObserver.observe(header);

//Fade In animation for sections
const allSections = document.querySelectorAll(".section");
const revealSection = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) {
        return;
    }
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});
allSections.forEach((section) => {
    section.classList.add("section--hidden");
    sectionObserver.observe(section);
});

//Lazy Loading Logic for all images that need to be replaced with high res images
const imageTargets = document.querySelectorAll("img[data-src]");
const loadImage = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    //Remove blur on low resolution images when high res image is loaded
    entry.target.addEventListener("load", () => {
        entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target); //Unobserve from the target as the image is already loaded ie our work is done
};
const imageObserver = new IntersectionObserver(loadImage, {
    root: null,
    threshold: 0,
    rootMargin: "200px", //Make sure that the upcoming images are loading before user reaches them
});
imageTargets.forEach((image) => imageObserver.observe(image));

//Slider Logic
const slides = document.querySelectorAll(".slide");
const buttonLeft = document.querySelector(".slider__btn--left");
const buttonRight = document.querySelector(".slider__btn--right");

let currentSlide = 0;

let maxSlides = slides.length;

const goToSlide = () => {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
    });
};

goToSlide(0);

buttonLeft.addEventListener("click", (e) => {
    if (currentSlide === 0) {
        currentSlide = maxSlides - 1;
    } else {
        currentSlide--;
    }

    goToSlide();
});
buttonRight.addEventListener("click", (e) => {
    if (currentSlide === maxSlides - 1) {
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    goToSlide();
});
