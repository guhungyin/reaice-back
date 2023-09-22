const express = require('express');
const router = express.Router();
const firebaseAdminDb = require('../connections/firebase_admin');
const convertPagination = require('../modules/convertPagination')

// 路徑
const productsMenuRef = firebaseAdminDb.ref('productsMenu'); //產品類別
const articlesRef = firebaseAdminDb.ref('articles'); // 文章內容 

router.get('/user', function(req, res, next) {
  res.render('dashboard/user', { title: 'Express' });
});
router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});
router.get('/product', function(req, res, next) {
  res.render('dashboard/product', { title: 'Express' });
});
router.get('/productsMenu', function(req, res, next) {
  const messages = req.flash('info');
  let currentPage = Number.parseInt(req.query.page) || 1; // 當前頁面
  productsMenuRef.once('value').then(function(snapshot){
    const productsMenuTotal = [];//預設一個資料量(陣列)，將讀取的資料物件用forEach，新增到陣列裡面，並取得長度。
    snapshot.forEach(function (snapshotChild) {
      productsMenuTotal.push(snapshotChild.val())
    })
    productsMenuTotal.reverse(); // 把資料順序反過來

    const data = convertPagination(productsMenuTotal,currentPage)

    res.render('dashboard/productsMenu', { 
      title: 'Express',
      messages,
      hasInfo: messages.length > 0,
      page: data.page,
      productsMenu: data.data,
      productsMenuTotal,
    });
  })
});


// 產品類別 -- 主類別 -- 新增
router.post('/productsMenu/create', function (req, res){
    const data = req.body;
    console.log(data);
    const productsMenusRef = productsMenuRef.push();
    const key = productsMenusRef.key;
    data.id = key;
    productsMenuRef.orderByChild('mainName').equalTo(data.mainName).once('value')
      .then(function(snapshot){
        if (snapshot.val() !== null) {
          req.flash('info','已有相同名稱');
          res.redirect('/dashboard/productsMenu')
        } else {
          productsMenusRef.set(data).then(function(){
            res.redirect('/dashboard/productsMenu')
          })
        }
      })
})

// 產品類別 -- 主類別 -- 更新
router.post('/productsMenu/update/:id', function(req,res){
  const data = req.body;
  const { id } = req.params;
  productsMenuRef.child(id).update(data).then(function(){
    res.redirect(`dashboard/productsMenu`);
  })
});


// 產品類別 -- 主類別 -- 刪除
router.post('/productsMenu/delete/:id', function(req,res){
  const id = req.params.id;
  productsMenuRef.child(id).remove();
  req.flash('info','欄位已刪除')
  res.redirect('/dashboard/productsMenu');
});




// 產品類別 -- 子類別 -- 新增

// 產品類別 -- 子類別 -- 更新

// 產品類別 -- 子類別 -- 刪除







module.exports = router;