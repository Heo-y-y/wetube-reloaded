/*import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import rootRouter from "./routers/rootRouter";
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const loggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }); 

  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false, 
      
      store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
      // session 저장 default -> mongoDB로 변경.
    })
    );
    
    app.use(flash());
    app.use(localsMiddleware);
    app.use("/uploads", express.static("uploads"));
    app.use("/static", express.static("assets"));
    app.use("/ffmpeg", express.static("node_modules/@ffmpeg/core/dist")); // ffmpeg할 때 오류 방지 코드
    // form value를 express application이 이해하도록 하는 설정
    
    // 반드시 sessionStore 뒤에 위치 해야함!
    // 그렇지 않으면 실행안됨!
    
    app.use("/", rootRouter);
    app.use("/videos", videoRouter);
    app.use("/users", userRouter);
    app.use("/api", apiRouter);
    
    export default app;
    
    /*app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });*/

// "express"라는 package를 express라는 이름으로 import해온 것.
import express from "express";
// morgan은 GET, path, status code ... 모든 정보를 가지고 있음.
import morgan from "morgan";
// session이라는 middleware가 브라우저에 cookie를 전송함.
import session from "express-session";
// 사용자에게 메세지를 남길 수 있게 함. session에 근거하기 때문에 사용자만이 볼 수 있음.
import flash from "express-flash";
// MongoStore 는 세션을 몽고DB에 저장함.
import MongoStore from "connect-mongo";
// 따로 독립되어있는 export한 라우터들을 모아 import한 것들.
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

// express는 html을 리턴하기 위해 pug를 사용할 거라고 지정함.
// console.log(process.cwd()); 해서 현재 작업 디렉토리를 확인해보자.
// 현재 작업 디렉토리는 node.js를 시작하는 디렉토리라는 것!!! 즉, 우리는 /wetube-reloaded
// "현재 작업 디렉토리" + /views" 설정해준다.
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
// express application이 form의 value들을 이해할 수 있도록 하고, form을 멋진 javascript object 형식으로 바꿔주는 middleware.
app.use(express.urlencoded({ extended: true })); // videoRouter > videoController > postEdit에 있는 req.body와 연결되는 지점.
// (2) express application이 보내진 string을 멋진 javascript object 형식으로 바꿔주는 middleware.
app.use(express.json()); // text를 json으로 다시 변환해서 backend에서 사용할 거라고 이해하는 것!

// session middleware
// express가 세션을 메모리에 저장하고 있다. 그러나, 서버 재시작되면, 세션을 잊어버리게 된다.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // 세션을 db에 저장하게끔 만드는 MongoStore 설정
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

// flash()가 session에 연결해서 사용자에게 메시지를 남길 게 할 것.
app.use(flash());
app.use(localsMiddleware);
// 폴더 전체를 브라우저에게 노출시킨다는 static files serving을 활성화 해준다.
// Express에게 만약 누군가 "/uploads"로 가려고 한다면, uploads폴더의 내용을 볼 수 있게 해줘야 하기 때문에.
// "uploads" 폴더는 multer가 파일을 저장하는 곳.
app.use("/uploads", express.static("uploads"));
// express에게 /assets 폴더를 User들한테 열람할 수 있게 설정함.
// 서버한테 assets 폴더의 내용물을 /static 주소를 통해 공개하라고 하는 것.
app.use("/static", express.static("assets"));
// createFFmpegCore is not defined at HTMLScriptElement.eventHandler (getCreateFFmpegCore.js:101)) 에러 해결!
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
// SharedArrayBuffer is not defined 에러 해결!
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
