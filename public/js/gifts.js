let k = {
  her :1,
  him :1,
}

function loadmore(sub_category) {
  let sub = sub_category;
  if(sub_category == "him"){
    sub = 'GIFTS FOR HIM'
  }
  else if (sub_category =="her") {
    sub = 'GIFTS FOR HER';
  }
  let container = document.getElementById(sub);
  let content = container.getElementsByClassName('content')[0];
  let load_more = container.getElementsByClassName('load-more')[0];
  let containerr = container.getElementsByClassName('container__load-more')[0]
  let loading_img = container.getElementsByClassName("loading-png")[0];
  let noMore = container.getElementsByClassName("No-more")[0];
  let loadingSec = container.getElementsByClassName("loading-sec")[0];
  containerr.style.display="none";
  loadingSec.classList.toggle('active');
  loading_img.style.display = "inline-block";
   $.post(`/loadmore/gift/${sub}`,{count : k[sub_category] },function(data){
      if(data.length == 0){
        noMore.style.display = "block";
        loading_img.style.display = "none";
      }
      else{
        loadingSec.classList.toggle('active');
        containerr.style.display="block";
        loading_img.style.display = "none";
        data.forEach((item, i) => {
          content.innerHTML+=`
          <div class="items">
            <img src="${item.thumbnail}" alt="">
            <h3 style="margin:0;">${item.name}</h3>
            <p class="item__desc">${item.desc.substring(0,351)}
               <b style="cursor : pointer;" onclick="modal('${item.id}')">Read More</b> </p>

               <div class="buttons">
              <p class="item__price"><b>${item.price}</b></p>
              <a href="${item.link}" class="btn-light buy-btn">Buy Now</a>
            </div>
          </div>
          `;
        });
        k[sub_category] +=1;
      }
   })

}
