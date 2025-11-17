<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>로그인</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/style.css?${resourceVersion}"/>
</head>
<body>
<!-- 로그인 박스 시작 -->
<div class="login-container">

    <div class="character-row">
        <img src="${pageContext.request.contextPath}/static/images/indexTop.png" class="logo" alt="지구방 로고"/>
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

    <div style="margin-top: 16px;">
        <a href="#">회원가입</a> |
        <a href="#">비밀번호 찾기</a>
    </div>

    <p style="margin-top: 40px; font-size: 12px; color: #999;">© ENERNET Inc.</p>
</div>
</body>
</html>
