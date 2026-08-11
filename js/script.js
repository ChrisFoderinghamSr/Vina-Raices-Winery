/* Vina Raices Winery JavaScript Functionality */


/* Vina Raices Winery Mobile Navigation */

const menuToggle = document.querySelector(
    ".menu-toggle"
);

const primaryNav = document.querySelector(
    "#primary-navigation"
);


menuToggle?.addEventListener(
    "click",
    () => {

        const isExpanded =
            menuToggle.getAttribute(
                "aria-expanded"
            ) === "true";


        menuToggle.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );


        primaryNav.classList.toggle(
            "open",
            !isExpanded
        );

    }
);


/* Vina Raices Winery Navigation Link Handling */

primaryNav?.querySelectorAll(
    "a"
).forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                menuToggle?.setAttribute(
                    "aria-expanded",
                    "false"
                );


                primaryNav.classList.remove(
                    "open"
                );

            }
        );

    }
);


/* Vina Raices Winery Wine Profile Elements */

const wineModal = document.querySelector(
    "#wine-modal"
);

const modalTitle = document.querySelector(
    "#modal-title"
);

const modalCopy = document.querySelector(
    "#modal-copy"
);

const modalClose = document.querySelector(
    ".modal-close"
);


/* Vina Raices Winery Wine Profile Data */

const wineProfiles = {

    "Reserva Familiar":
        "A fictional estate reserve concept emphasizing depth, structure, and the idea of a family cellar preserved across generations.",


    "Selección de Raíces":
        "A fictional signature selection inspired by heritage, craftsmanship, and a refined family tradition.",


    "Herencia Blanco":
        "A fictional white wine concept designed around a crisp, aromatic character and a bright expression of the estate.",


    "Rosado de Familia":
        "A fictional rosé concept built around freshness, balance, and the celebratory side of family gatherings.",


    "Gran Reserva":
        "A fictional cellar collection representing the most limited and ceremonial expression of the Viña Raíces story."

};


/* Vina Raices Winery Wine Profile Buttons */

document.querySelectorAll(
    ".wine-detail"
).forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const wineName =
                    button.dataset.wine;


                modalTitle.textContent =
                    wineName;


                modalCopy.textContent =
                    wineProfiles[wineName] ||
                    "Fictional wine profile.";


                if (
                    typeof wineModal.showModal ===
                    "function"
                ) {

                    wineModal.showModal();

                }

            }
        );

    }
);


/* Vina Raices Winery Wine Profile Close Button */

modalClose?.addEventListener(
    "click",
    () => {

        wineModal.close();

    }
);


/* Vina Raices Winery Wine Profile Backdrop */

wineModal?.addEventListener(
    "click",
    (event) => {

        const modalBounds =
            wineModal.getBoundingClientRect();


        const clickedInsideModal =
            event.clientX >= modalBounds.left &&
            event.clientX <= modalBounds.right &&
            event.clientY >= modalBounds.top &&
            event.clientY <= modalBounds.bottom;


        if (!clickedInsideModal) {

            wineModal.close();

        }

    }
);


/* Vina Raices Winery Newsletter Form */

const signupForm = document.querySelector(
    "#signup-form"
);

const formStatus = document.querySelector(
    "#form-status"
);


signupForm?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const formData =
            new FormData(signupForm);


        const email =
            formData.get("email");


        if (!email) {

            formStatus.textContent =
                "Please enter a valid email address.";

            return;

        }


        formStatus.textContent =
            "Thank you. Welcome to the Viña Raíces family.";


        signupForm.reset();

    }
);