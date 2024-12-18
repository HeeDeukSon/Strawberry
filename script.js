document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("comment-form");
    const commentList = document.getElementById("comment-list");

    // 로컬 스토리지에서 댓글 불러오기
    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem("comments")) || [];
        return comments;
    };

    // 로컬 스토리지에 댓글 저장
    const saveComments = (comments) => {
        localStorage.setItem("comments", JSON.stringify(comments));
    };

    // 댓글 렌더링
    const renderComments = () => {
        const comments = loadComments();
        commentList.innerHTML = ""; // 리스트 초기화

        comments.forEach((comment, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${comment.name}</strong> <span style="color: gray;">(${comment.time})</span>
                <p>${comment.text}</p>
                <button class="delete-btn" data-index="${index}">삭제</button>
            `;
            commentList.appendChild(li);
        });

        // 삭제 버튼 이벤트 추가
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                deleteComment(index);
            });
        });
    };

    // 댓글 추가
    const addComment = (name, contact, text) => {
        const comments = loadComments();
        const time = new Date().toLocaleString();
        comments.push({ name, contact, text, time });
        saveComments(comments);
        renderComments();
    };

    // 댓글 삭제
    const deleteComment = (index) => {
        const comments = loadComments();
        comments.splice(index, 1);
        saveComments(comments);
        renderComments();
    };

    // 폼 제출 이벤트
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const text = document.getElementById("comment").value.trim();

        // 연락처 유효성 검사
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

    // 페이지 로드 시 댓글 렌더링
    renderComments();
});
