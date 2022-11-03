const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const url = require('url');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const mailer = require('../config/mail');

const router = express.Router();


  // 회원 가입
  router.post('/signup', isNotLoggedIn, async (req, res, next) => { // POST /auth/signup
    try {
      const exUser = await User.findOne({
        where: {
          id: req.body.id,
        }
      });

      if (exUser) {
        return res.status(403).send('이미 사용 중인 아이디입니다.');
      }

      const signupToken = jwt.sign({
        id: req.body.id,
        email: req.body.email,
      }, process.env.JWT_SECRET, {
        expiresIn: '30m', // 30분
        issuer: 'ottservice',
      });

      let emailParam = {
        toEmail: req.body.email,
        signupToken: signupToken
      };
    
      mailer.sendGmail(emailParam);

      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      await User.create({
        email: req.body.email,
        name: req.body.name,
        id: req.body.id,
        password: hashedPassword,
        signupToken: signupToken
      });
      res.status(201).send({success:true,message:"인증 메일 발송 성공"});
    } catch (error) {
      console.error(error);
      next(error); // status 500
    }
  });

  router.get('/signupToken', isNotLoggedIn, (req, res, next) => { // GET /auth/signupToken
   try {
      
      const queryData = url.parse(req.url, true).query;
      req.decoded = jwt.verify(queryData.token, process.env.JWT_SECRET);
      User.update({role: 1,}, {
        where: { email: req.decoded.email }
      });
      res.status(200).json({success:true,message:"회원가입 성공, 로그인 진행"});
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') { // 유효기간 초과
        return res.status(419).json({
          code: 419,
          message: '토큰이 만료되었습니다',
        });
      }
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다',
      });
    }
    
  });

  // 로그인
  router.post('/login', isNotLoggedIn, (req, res, next) => { // POST /auth/login
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }
        const fullUserWithoutPassword = await User.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ['password']
          },
        })
        return res.status(200).json(fullUserWithoutPassword);
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });


  // 로그아웃
  router.post('/logout', isLoggedIn, (req, res) => { // POST /auth/logout
    req.logout();
    req.session.destroy();
    res.send('ok');
  });

/*
구글 로그인 1)

프로파일과 이메일 정보 받는 설정을 함.
GET /auth/google

*/
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
 
/*
 구글 로그인 2) callback url

 위에서 구글 서버 로그인이 되면, 구글 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 
 내부적으로 인증 코드를 받고,
 passport 로그인 전략에 의해 googleStrategy 로 이동한다.
 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리.

 GET /auth/google/callback
*/
router.get(
   '/google/callback',passport.authenticate('google', { 
   failureRedirect: '/' }),
   (req, res) => {
      res.redirect('/');
   },
);

router.get("/", async (req, res, next) => {  // GET /auth
 
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {exclude: ["password"],}
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 비밀번호 변경
router.patch('/password', isLoggedIn, async (req, res, next) => { // PATCH /auth/password
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.update({
      password: hashedPassword,
    }, {
      where: { id: req.user.id },
    });
    res.status(200).json({ id: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// channerId 변경
router.patch('/channerId', isLoggedIn, async (req, res, next) => { // PATCH /auth/channerId
  try {
    await User.update({
      channerId: req.body.channerId,
    }, {
      where: { id: req.body.id },
    });
    res.status(200).json({ id: req.body.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;