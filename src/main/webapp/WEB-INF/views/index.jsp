<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>모바일 웹</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/style.css">
    <script src="${pageContext.request.contextPath}/static/js/script.js"></script>
</head>
<body>
<div class="container">
    <h1>모바일 웹 예제</h1>
    <button id="btnClick">버튼 클릭</button>
    <p id="output"></p>
</div>
</body>
</html>
