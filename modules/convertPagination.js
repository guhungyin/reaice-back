const convertPagination = function (resource, currentPage,currentPageRef,perPage){ // 原始資料 當前頁面
  //分頁
  const totalResult = resource.length; //總資料
  const pageTotal = Math.ceil(totalResult / perPage); //總頁數 無條件進位Math.ceil
  if(currentPage > pageTotal) { // 當前頁數不能比總頁數大
    currentPage = pageTotal
  }

  const minItem = (currentPage * perPage) - perPage + 1; // 當前頁面第一筆
  const maxItem = (currentPage * perPage); // 當前頁面最後一筆
  // 使用結果反推公式
  const data = []; // 設一個新陣列 要放此頁面的資料量
  resource.forEach(function(item , i){
    let itemNum = i + 1;
    if(itemNum >= minItem && itemNum <= maxItem){  
      data.push(item);
    }
  })
  const page = {
    pageTotal, // 總共有幾頁
    currentPage, //目前在第幾頁
    hasPre: currentPage > 1, // 上一頁
    hasNext: currentPage < pageTotal, // 下一頁
    currentPageRef, // 當前頁面路徑
    totalResult // 總資料
  }
  return {
    page, // 回傳頁面資訊
    data // 回傳整理好的資料
  }
}

module.exports = convertPagination;
