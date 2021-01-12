
function modal(item){
  // console.log(item);
  // console.log(item.name);
  $("#modal").show();
  $("html, body").animate({ scrollTop: $(window).scrollTop() });
  $("#title")[0].innerText = item.title;
  $("#description")[0].innerText = item.description;
  $("#price")[0].innerText = item.category;
  // document.getElementById('link').setAttribute('href',item.link)
}


function modalClose(){
  $("#modal").hide();
}
