let k = {
  Europe :1,
  America :1,
  Africa : 1,
  Asia : 1,
  Antarctica :1,
  Australasia :1
}

function loadmore(sub_category) {
  let sub = sub_category;
  let container = document.getElementById(sub);
  let content = container.getElementsByClassName('content')[0];
  let load_more = container.getElementsByClassName('load-more')[0];
  let containerr = container.getElementsByClassName('container__load-more')[0]
  let noMore = container.getElementsByClassName("No-more")[0];
  let loadingSec = container.getElementsByClassName("loading-sec")[0];
  containerr.style.display="none";
  loadingSec.classList.toggle('active');
   $.post(`/loadmore/gift/${sub}`,{count : k[sub_category] },function(data){
      if(data.length == 0){
        noMore.style.display = "block";

      }
      else{
        loadingSec.classList.toggle('active');
        containerr.style.display="block";
        data.forEach((item, i) => {
          let desc = `${item.desc}`
          content.innerHTML+=`
          <div class="items">
            <img src="${item.thumbnail}" alt="">
            <h3 style="margin:0;">${item.name}</h3>
            <p class="item__desc">${item.desc.substring(0,351)}
            <b style="cursor : pointer;" onclick="modal({name : '${item.name}' ,description : `+"`"+desc+"`" +`, price : '${item.price}' , link : '${item.link}'})">Read More</b> </p>

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
