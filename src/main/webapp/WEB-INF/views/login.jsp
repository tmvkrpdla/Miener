<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>로그인</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/style.css"/>
</head>
<body>
<!-- 로그인 박스 시작 -->
<div class="login-container">
    <img src="${pageContext.request.contextPath}/static/img/logo.png" class="logo" alt="지구방 로고"/>
    <div class="subtitle">지구를 구하는 방법</div>

    <div class="character-row">
        <img src="${pageContext.request.contextPath}/static/img/char1.png" alt="캐릭터1"/>
        <img src="${pageContext.request.contextPath}/static/img/char2.png" alt="캐릭터2"/>
        <img src="${pageContext.request.contextPath}/static/img/char3.png" alt="캐릭터3"/>
    </div>

    <form action="${pageContext.request.contextPath}/login" method="post">
        <label for="username">전화번호 또는 아이디</label><br/>
        <input type="text" id="username" name="username" required/><br/>

        <label for="password">비밀번호</label><br/>
        <input type="password" id="password" name="password" required/><br/>

        <button type="submit">로그인 하기</button>
    </form>

    <div style="margin-top: 16px;">
        <a href="#">회원가입</a> |
        <a href="#">비밀번호 찾기</a>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #999;">© ENERNET Inc.</p>
</div>
</body>
</html>
