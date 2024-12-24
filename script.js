document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("comment-form");
    const commentList = document.getElementById("comment-list");
    const video = document.getElementById("berryVideo");

    // Video interaction logic
    if (video) {
        video.addEventListener("canplay", () => {
            console.log("Video loaded and ready to play.");
            video.play(); // Ensure video starts playing
        });

        video.addEventListener("error", () => {
            console.error("Error loading video file.");
            alert("Video cannot be played. Please check the file path or format.");
        });
    } else {
        console.error("Video element not found.");
    }
    // Horizontal scrolling functionality for the navigation bar
    const nav = document.querySelector("header nav");
    const leftButton = document.querySelector(".nav-scroll.left");
    const rightButton = document.querySelector(".nav-scroll.right");

    if (nav && leftButton && rightButton) {
        // Ensure the "소개" menu is visible on page load
        const firstMenuItem = nav.querySelector("a:first-child");
        if (firstMenuItem) {
            nav.scrollLeft = 0; // Set the scroll position to the start
        }

        // Function to toggle button visibility
        const toggleScrollButtons = () => {
            const maxScrollLeft = nav.scrollWidth - nav.clientWidth;

            // Show/hide left button
            if (nav.scrollLeft > 0) {
                leftButton.style.display = "block";
            } else {
                leftButton.style.display = "none";
            }

            // Show/hide right button
            if (nav.scrollLeft < maxScrollLeft) {
                rightButton.style.display = "block";
            } else {
                rightButton.style.display = "none";
            }
        };

        // Trigger the toggle on page load
        toggleScrollButtons();

        // Scroll left button logic
        leftButton.addEventListener("click", () => {
            if (firstMenuItem) {
                const menuRect = firstMenuItem.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();

                // Scroll to the beginning if "소개" is not fully visible
                if (menuRect.left < navRect.left || menuRect.right > navRect.right) {
                    nav.scrollTo({ left: 0, behavior: "smooth" });
                }
            }
        });

        // Scroll right button logic
        rightButton.addEventListener("click", () => {
            nav.scrollBy({ left: 100, behavior: "smooth" });
        });

        // Add scroll event listener to update button visibility
        nav.addEventListener("scroll", toggleScrollButtons);

        // Prevent overscrolling
        nav.addEventListener("scroll", () => {
            const maxScrollLeft = nav.scrollWidth - nav.clientWidth;
            if (nav.scrollLeft < 0) nav.scrollLeft = 0;
            if (nav.scrollLeft > maxScrollLeft) nav.scrollLeft = maxScrollLeft;
        });
    }


    // Load comments from local storage
    const loadComments = () => JSON.parse(localStorage.getItem("comments")) || [];

    // Save comments to local storage
    const saveComments = (comments) => {
        localStorage.setItem("comments", JSON.stringify(comments));
    };

    // Render comments
    const renderComments = () => {
        const comments = loadComments();
        commentList.innerHTML = ""; // Clear list

        comments.forEach((comment, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${comment.name}</strong> <span style="color: gray;">(${comment.time})</span>
                <p>${comment.text}</p>
                <button class="delete-btn" data-index="${index}">삭제</button>
            `;
            commentList.appendChild(li);
        });

        // Add delete event to buttons
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                deleteComment(index);
            });
        });
    };

    // Add a comment
    const addComment = (name, contact, text) => {
        const comments = loadComments();
        const time = new Date().toLocaleString();
        comments.push({ name, contact, text, time });
        saveComments(comments);
        renderComments();
    };

    // Delete a comment
    const deleteComment = (index) => {
        const comments = loadComments();
        comments.splice(index, 1);
        saveComments(comments);
        renderComments();
    };

    // Form submit event
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const contact = document.getElementById("contact").value.trim();
            const text = document.getElementById("comment").value.trim();

            // Validate contact info
            const contactIsValid = 
                contact === "" || 
                /^[^@]+@[^@]+\.[^@]+$/.test(contact) || 
                /^\d{3}-\d{3,4}-\d{4}$/.test(contact);

            if (!name || !text) {
                alert("이름과 댓글을 모두 입력하세요.");
                return;
            }

            if (!contactIsValid) {
                alert("연락처는 이메일 또는 전화번호 형식이어야 합니다.");
                return;
            }

            addComment(name, contact, text);
            form.reset();
        });
    }

    // Render comments on page load
    renderComments();
});
