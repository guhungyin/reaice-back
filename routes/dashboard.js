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
    title: 'Express',
    currentPageRef
  });
});
router.get('/article', function(req, res, next) {
  const currentPageRef = '/article' // 分頁的路徑
  res.render('dashboard/article', { 
    title: 'Express',
    currentPageRef
  });
});
router.get('/product', function(req, res, next) {
  const currentPageRef = '/product' // 分頁的路徑
  res.render('dashboard/product', { 
    title: 'Express',
    currentPageRef
  });
});
// 產品選單頁面
router.get('/productsMenu', function(req, res, next) {
  const messages = req.flash('info');
  let currentPage = Number.parseInt(req.query.page) || 1; // 當前頁面
  productsMenuRef.once('value').then(function(snapshot){

    const productsMenuTotal = []; //預設一個資料量(陣列)，將讀取的資料物件用forEach，新增到陣列裡面，並取得長度。
    snapshot.forEach(function (snapshotChild) {
      productsMenuTotal.push(snapshotChild.val())
    })
    productsMenuTotal.reverse(); // 把資料順序反過來



    const perPage = 3 //每頁顯示10資料
    const currentPageRef = '/productsMenu' // 分頁的路徑
    
    const data = convertPagination(productsMenuTotal,currentPage,currentPageRef,perPage);
    
    res.render('dashboard/productsMenu', { 
      title: 'Express',
      messages,
      hasInfo: messages.length > 0,
      page: data.page,
      productsMenu: data.data,
      productsMenuTotal,
      currentPageRef
    });
    
    
  })
});


// 產品選單 -- 主選單 -- 新增
router.post('/productsMenu/create', function (req, res){
  const data = req.body;
  let menuRef = firebaseAdminDb.ref(`productsMenu/${data.path}`)
  productsMenuRef.orderByChild('path').equalTo(data.path).once('value')
    .then(function(snapshot){
      if (snapshot.val() !== null) {
        req.flash('info','已有相同名稱');
        res.redirect('/dashboard/productsMenu')
      } else {
        menuRef.set(data).then(function(){
          res.redirect('/dashboard/productsMenu')
        })
      }
    })
})

// 產品選單 -- 主選單 -- 更新
router.post('/productsMenu/update/:path', function(req,res){
  const data = req.body;
  productsMenuRef.child(data.path).update(data).then(function(){
    req.flash('info','子項目已更新')
    res.redirect(`/dashboard/productsMenu`);
  })
});


// 產品選單 -- 主選單 -- 刪除
router.post('/productsMenu/delete/:path', function(req,res){
  productsMenuRef.child(req.params.path).remove();
    req.flash('info','主選單已刪除')
    res.redirect('/dashboard/productsMenu');
});




// 產品選單 -- 子選單 -- 新增
router.post('/productsMenu/createSubMenu/:path', function (req, res){
  const data = req.body;

  const id = req.params.id;
console.log(data,id);
  const subMenusRef = firebaseAdminDb.ref(`productsMenu/${id}/subMenus`);
  // const productsSubMenusRef = subMenusRef.push(data.subName);
  // subMenusRef.orderByValue().equalTo(data.subName).once('value')
  // .then(function(snapshot){
  //   if (snapshot.val() !== null) {
  //     req.flash('info','已有相同名稱');
  //     res.redirect('/dashboard/productsMenu')
  //   } else {
  //     productsSubMenusRef.then(function () {
  //       res.redirect(`/dashboard/productsMenu`);
  //     })
  //   }
  // })


})
// 產品選單 -- 子選單 -- 更新
router.post('/productsMenu/updateSubName/:id', function(req,res){
  // const subMenusRef = firebaseAdminDb.ref(`productsMenu/${id}/subMenus`);
  const id = req.params.id;
  console.log(id);
  const data = req.body;
  console.log(data);
  // subMenusRef.child(id).update(data);
  // req.flash('info','子項目已更新')
  // res.redirect('/dashboard/productsMenu');
});

// 產品選單 -- 子選單 -- 刪除

router.post('/productsMenu/deleteSubName/:id', function(req,res){
  const id = req.params.id;
  const subMenusRef = firebaseAdminDb.ref(`/subMenus`);
  const data = req.body;
  // subMenusRef.orderByKey(id).remove();
  // req.flash('info','子項目已刪除')
  // res.redirect('/dashboard/productsMenu');
});







module.exports = router;
