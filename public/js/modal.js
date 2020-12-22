
function modal(item){
  console.log(item);
  console.log(item.name);
  $("#modal").show();
  $("html, body").animate({ scrollTop: $(window).scrollTop() });
  $("#title")[0].innerText = item.name;
  $("#description")[0].innerText = item.description;
  $("#price")[0].innerText = item.price;
  document.getElementById('link').setAttribute('href',item.link)
}


function modalClose(){
  $("#modal").hide();
}
