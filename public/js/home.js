let count = 1 ;
let content = document.getElementById('content');
let load_more = document.getElementById('load-more');
let container = document.getElementById('container__load-more')

let noMore = document.getElementById("No-more");


load_more.addEventListener('click',()=>{
container.style.display="none";

 $.post("/loadmore",{count : count},function(data){
    if(data.length == 0){
      noMore.style.display = "block";

    }
    else{
      container.style.display="block";

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
      count+=1;
    }
 })
})
