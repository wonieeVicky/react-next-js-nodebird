const http = require("http"); // http가 서버의 역할을 해준다.
const { isRegExp } = require("util");

// req: request, front에서 넘어온 요청에 대한 정보가 담긴다.
// res: response, 응답에 대한 정보가 담긴다.
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.write("<h1>hello vicky1</h1>");
  res.write("<h2>hello vicky2</h2>");
  res.write("<h3>hello vicky3</h3>");
  res.write("<h4>hello vicky4</h4>");
  res.end("<h5>Hello node!!</h5>");
});
server.listen(3065, () => {
  console.log("서버 실행 중");
});
