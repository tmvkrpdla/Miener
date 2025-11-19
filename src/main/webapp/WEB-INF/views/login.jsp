<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>로그인</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/style.css?${resourceVersion}"/>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const loginButton = document.getElementById('loginBtn');

            // 입력 필드 상태를 확인하고 버튼을 업데이트하는 함수
            function checkInputsAndToggleButton() {
                const isUsernameFilled = usernameInput.value.trim().length > 0;
                const isPasswordFilled = passwordInput.value.trim().length > 0;

                if (isUsernameFilled && isPasswordFilled) {
                    // ✅ 두 필드 모두 채워졌을 때: active 클래스 추가 (버튼 활성화)
                    loginButton.classList.add('active');
                    loginButton.disabled = false; // 버튼 활성화
                } else {
                    // ✅ 하나라도 비어있을 때: active 클래스 제거 (버튼 비활성화)
                    loginButton.classList.remove('active');
                    loginButton.disabled = true; // 버튼 비활성화 (선택 사항)
                }
            }

            // 아이디 및 비밀번호 입력 필드에 keyup(키를 뗄 때) 이벤트 리스너 추가
            usernameInput.addEventListener('keyup', checkInputsAndToggleButton);
            passwordInput.addEventListener('keyup', checkInputsAndToggleButton);

            // 페이지 로드 시 초기 상태를 한 번 확인합니다.
            checkInputsAndToggleButton();
        });
    </script>
</head>
<body>
<!-- 로그인 박스 시작 -->
<div class="login-container">

    <div class="character-row">
        <img src="${pageContext.request.contextPath}/static/images/loginBackGround.png" class="logo" alt="배경화면"/>
    </div>

    <form action="${pageContext.request.contextPath}/login" method="post">

        <div class="login-box">
            <label class="login-label" for="username">아이디</label>
            <input type="text" id="username" name="username" placeholder="아이디를 입력하세요" required/>

            <label class="login-label" for="password">비밀번호</label>
            <input type="password" id="password" name="password" placeholder="비밀먼호를 입력하세요" required/>
        </div>

        <button id="loginBtn" type="submit">로그인 하기</button>
    </form>

    <div class="login-links">
        <a href="#">회원가입</a>
        <span>|</span>
        <a href="#">비밀번호 찾기</a>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #999;">© ENERNET Inc.</p>
</div>
</body>
</html>
