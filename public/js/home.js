let count = 1 ;
let content = document.getElementById('content');
let load_more = document.getElementById('load-more');
let container = document.getElementById('container__load-more')
let loading_img = document.getElementById("loading-png");
let noMore = document.getElementById("No-more");


load_more.addEventListener('click',()=>{
container.style.display="none";
loading_img.style.display = "inline-block";
 $.post("/loadmore",{count : count},function(data){
    if(data.length == 0){
      noMore.style.display = "block";
      loading_img.style.display = "none";
    }
    else{
      container.style.display="block";
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
      count+=1;
    }
 })
})
