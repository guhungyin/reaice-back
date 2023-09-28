const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase_admin');
const convertPagination = require('../modules/convertPagination')

// 路徑
const productsMenuRef = firebaseAdminDb.ref(`productsMenu`); //產品選單
const articlesRef = firebaseAdminDb.ref('articles'); // 文章內容 

router.get('/user', function(req, res, next) {
  const currentPageRef = '/user' // 分頁的路徑
  res.render('dashboard/user', {
    currentPageRef
  });
});
router.get('/article', function(req, res, next) {
  const currentPageRef = '/article' // 分頁的路徑
  res.render('dashboard/article', {
    currentPageRef
  });
});
router.get('/product', function(req, res, next) {
  const currentPageRef = '/product' // 分頁的路徑
  res.render('dashboard/product', {
    currentPageRef
  });
});
// 產品選單頁面
router.get('/productsMenu', function(req, res, next) {
  const messages = req.flash('info');
  let currentPage = Number.parseInt(req.query.page) || 1; // 當前頁面
  productsMenuRef.once('value')
  .then(function(snapshot){
    const productsMenuTotal = []; //預設一個資料量(陣列)，將讀取的資料物件用forEach，新增到陣列裡面，並取得長度。
    snapshot.forEach(function (snapshotChild) {
      productsMenuTotal.push(snapshotChild.val())
    })
    productsMenuTotal.reverse(); // 把資料順序反過來
    const perPage = 10 //每頁顯示10資料
    const currentPageRef = '/productsMenu' // 分頁的路徑
    const data = convertPagination(productsMenuTotal,currentPage,currentPageRef,perPage);
    res.render('dashboard/productsMenu', {
      messages,
      hasInfo: messages.length > 0,
      page: data.page,
      productsMenu: data.data,
      productsMenuTotal,
      currentPageRef
    });
    // res.send({ 
    //   "success": true,
    //   "message": "已取得資料"
    // })
  })
});

// 產品選單 -- 主選單 -- 新增
router.post('/productsMenu/create', function (req, res){
  const data = req.body;
  const menuRef = firebaseAdminDb.ref(`productsMenu/${data.path}`);
  productsMenuRef.orderByChild('path').equalTo(data.path).once('value')
    .then(function(snapshot){
      if (snapshot.val() !== null) {
        req.flash('info','已有相同名稱');
        res.redirect('/dashboard/productsMenu')
        // res.send({ 
        //   "success": true,
        //   "message": "已有重複的主選單名稱"
        // })
      } else {
        menuRef.set(data).then(function(){
          res.redirect('/dashboard/productsMenu')
          // res.send({ 
          //   "success": true,
          //   "message": "已新增主選單"
          // })
        })
      }
    })
})

// 產品選單 -- 主選單 -- 更新
router.post('/productsMenu/update/:path', function(req,res){
  const data = req.body;
  productsMenuRef.child(data.path).update(data)
    .then(function(){
      req.flash('info','子項目已更新')
      res.redirect(`/dashboard/productsMenu`);
    })
});

router.put('/productsMenu/update/:path', function(req,res){
  const data = req.body;
  productsMenuRef.child(data.path).update(data)
    .then(function(){
      req.flash('info','子項目已更新')
      // res.redirect(`/dashboard/productsMenu`);
      res.send({ 
        "success": true,
        "message": "已更新主選單"
      })
    })
    .catch(function (){
      res.send({ 
        "success": false,
        "message": "路徑不存在"
      })
    })
});

// 產品選單 -- 主選單 -- 刪除
router.post('/productsMenu/delete/:path', function(req,res){
  productsMenuRef.child(req.params.path).remove()
    .then(function (){
      req.flash('info','主選單已刪除')
      res.redirect('/dashboard/productsMenu');
    })
});

router.delete('/productsMenu/delete/:path', function(req,res){
  productsMenuRef.child(req.params.path).remove()
    .then(function (){
      req.flash('info','主選單已刪除')
      res.send({ 
        "success": true,
        "message": "已刪除主選單"
      })
    })
    .catch(function (){
      res.send({ 
        "success": false,
        "message": "找不到主選單"
      })
    })
});

// 產品選單 -- 子選單 -- 新增
router.post('/productsMenu/createSubMenu/:path', function (req, res){
  const data = req.body;
  const path = req.params.path;
  const subMenuRef = firebaseAdminDb.ref(`productsMenu/${path}/subMenus`);
  subMenuRef.orderByChild('subName').equalTo(data.subName).once('value')
    .then(function(snapshot){
      if (snapshot.val() !== null) {
        req.flash('info','已有相同名稱');
        res.redirect('/dashboard/productsMenu')
      } else {
        subMenuRef.push(data).then(function(){
          res.redirect(`/dashboard/productsMenu`);
        })
      }
    })
})

// 產品選單 -- 子選單 -- 更新
router.post('/productsMenu/:path/updateSubName/:id', function(req,res){
  const data = req.body;
  const id = req.params.id;
  const path = req.params.path;
  const subMenuRef = firebaseAdminDb.ref(`productsMenu/${path}/subMenus`);
  subMenuRef.child(id).update(data)
    .then(function () {
      req.flash('info','子項目已更新')
      res.redirect('/dashboard/productsMenu');
    })
});

// 產品選單 -- 子選單 -- 刪除
router.post('/productsMenu/:path/deleteSubName/:id', function(req,res){
  const id = req.params.id;
  const path = req.params.path;
  const subMenuRef = firebaseAdminDb.ref(`productsMenu/${path}/subMenus`);
  subMenuRef.child(id).remove()
    .then(function () {
      req.flash('info','子項目已刪除')
      res.redirect('/dashboard/productsMenu');
    })
});







module.exports = router;
