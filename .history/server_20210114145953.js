require("dotenv").config();
const express = require("express");
const bp = require("body-parser");
const cookie = require("cookie-parser");
const bycrypt = require("bcryptjs");
const verify = require("./middleware/verify");

const app = express();
const User = require("./models/users");
const Thumbnail = require("./models/thumbnail");
const Items = require("./models/items");
const Blog = require("./models/blog");
const mongoose = require("mongoose");
const methodOveride = require("method-override");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.locals.baseURL = "http://affiliate_marketing_aidal.herokuapp.com";

// let top_items = [
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/12/makeup-as-skincare-feature-650x780.jpg",
//     title: "Our Favourite Organic Makeup with Skincare Benefits",
//     category: "Beauty",
//     description:
//       "Conventional makeup famously can contain harmful ingredients for the skin (and the environment). Some of these ingredients will clog your pores, dry out the skin, and cause premature aging. If you’re wearing makeup for six to twelve hours, your skin should be benefiting! Sadly, lots of products contain perfumes, dyes, paraffins, parabens, and silicones. All of which are bad for our skin, our bodies, and the environment. Skip these nasty chemicals and switch to organic makeup that doubles as skincare! There is nothing better than a multi-use product! Masasi 7’s All Over Colours are fantastic because they work wonderfully on the eyes, lips, and cheeks. They are sheer but pigmented enough to layer up. Plus, they contain great ingredients for our skin, such as Apricot Oil, which is incredibly hydrating." +
//       "Apricot Oil is naturally high in vitamin E, which boosts the skin’s natural ability to protect itself from environmental damage, which helps keep the skin forever youthful and glowy! This product also contains Castor Oil, which is a superhero ingredient for fighting acne and soothing inflamed skin.",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/11/home-christmas-gifts-feature-650x780.jpg",
//     title: "Our Favourite Sustainable Christmas Gifts for Home",
//     category: "Home",
//     description:
//       "With us spending more time at home than ever before, this year we have really learnt the importance of making our homes a sanctuary for us to spend our days and evenings, unwind and relax! Here we share six of our favourite labels for home accessories that we think would make a beautiful and considered Christmas gift to make a home feel a little more special. " +
//       "Let’s be honest, a lot of wine has been consumed in 2020. Your delicious organic wine should be consumed in beautiful glasses, designed to last forever. The R+D. LAB glasses are crafted from borosilicate glass, which is known for its pure and resistant quality, meaning you’ll have them forever. Pair these glasses with a natural or organic wine from Low Intervention for a perfect gift, for yourself or a loved one.",
//   },
// ];
// let items = [
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/archivist-feature-430x580.jpg",
//     title: "Rêve En Vert x Archivist Studio: The Perfect White Shirt",
//     category: "Fashion",
//     description:
//       "The pandemic has taught us that we must consider and reassess how we can live our lives more considerately and sustainably if we are to protect our Earth, both in our personal and professional lives. At REV, we are passionate about supporting the brands who are working to produce and sell in harmony with our Earth, not against it. To help us launch our new sustainable shirt line, Archivist Studio, we ask a selection of influencers ‘What is your greatest tip for living a more conscious lifestyle?’. We hope you find their answers inspiring!" +
//       "We all have an individual responsibility to our planet, to learn to live with less. A minimal lifestyle isn’t about aesthetic fulfillment; it’s about reducing the energy, carbon and eventual waste that have defined consumption since time immemorial. We can and must do better for the Earth." +
//       "",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/02/reve-en-vert-shaina-mote-1.-430x580.jpg",
//     title: "A Sustainable Life With Shaina Mote",
//     category: "Fashion",
//     description:
//       "We are so excited to have brought on the ethical fashion line, Shaina Mote, to Rêve En Vert. Shaina herself is a California resident, and the simple casual elegance that defines the line can be seen as having been drawn from her inspiration of life in nature there. We ask her about the origins of her line, how her collections are sustainable, and how she lives her life in the same way. When I was in my early 20’s, I worked in fast fashion as a buyer. I was discouraged by the lack of care for the people and planet.  I felt the design sensibility was driven towards trendy items only.  Learning from that experience as a young woman, I knew I wanted to make something with care that would become a future heirloom in the wearer’s wardrobe. I want to make pieces that make women feel empowered with regard to the people and planet in how it was made.",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/04/sustainbale-life-emma-elwin-featured-430x580.jpg",
//     title: "Emma Elwin In Our Ren Sustainable Fashion Exclusive",
//     category: "Fashion",
//     description:
//       "In this editorial we chat to Emma Elwin, a beautiful ethical influencer and co-founder of the sustainable style platform, Make It Last. At REV we have been inspired by Emma for a long time, not only for her incredible style, but for her drive and enthusiasm in encouraging a more considered, conscious lifestyle. So we were very happy to learn all about her sustainable daily rituals and how she is coping with staying at home at this time. Home is our apartment which is located in an old porslin factory in the arkipelag of Stockholm. This is the place I’ve felt most at home – living here is a bliss, close to the ocean and nature, and close to the big city. Right now we are being woken up by our three year old that wakes up way too early. Coffee is paramount and after that we start making breakfast for the whole family – human and dogs!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/05/olive-cooke-reve-en-vert-feature-430x580.jpg",
//     title: "A Sustainable Life With Olive Cooke",
//     category: "Fashion",
//     description:
//       "In this editorial we chat to Olive Cooke, creator of ethical and sustainable resort wear label, Cooke & Kin. Olive shares with us her everyday rituals, from breakfast to beauty, as well as her thoughts on sustainability and what drives her to lead a more conscious lifestyle. She also models some of her favourite organic picks from the site, including a CAES organic cotton bodysuit and Woron organic cotton socks. My daily beauty routine is my time to slow down & reconnect, something that has become quite a ritual while spending more time at home. Each morning I will cleanse, apply Vitamin C, mouturiser & SPF. In the evenings I will then cleanse again, apply serums, eye cream & mousturiser before bed.",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/11/gifts-for-stress-feature-430x580.jpg",
//     title: "Conscious Christmas Gifts for Combating Stress",
//     category: "Lifestyle",
//     description:
//       "2020 has been an incredibly stressful year globally and of course we all have our own personal stresses as well. We believe having healthy tools to deal with stress is incredibly important. If you’re struggling to find gifts for your loved ones, we hope this gift guide is especially helpful for you! Lighting incense can be a wonderful ritual that can go along with yoga, meditation, or your evening routine. Bodha’s smokeless incense spread therapeutic scents, without filling your room up with smoke. They have a great selection of different scents to evoke different feelings. For your loved ones, who need a little help calming a busy mind, the Ground incense is perfect. The earthy scent is a combination of hinoki, cedarwood, and frankincense, which together create a truly grounding feeling when inhaled. Pair a box of incense with one of our beautiful incense holders for a wonderful gift! The oil is a gorgeous blend of clean and light citrus and flowers. Petitgrain and jasmine’s refreshing floral notes harmonise with grapefruits main component limonene, which stimulates and creates a sense of clarity. Our Beauty Editor Taylor swears by this oil for a pick me up during a long day. Not only does it linger on the skin, making it a beautiful perfume for others to smell but it really does provide a mood boost!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/12/love-gifts-featured-430x580.jpg",
//     title: "Sustainable Gifts for Keeping the Love Alive",
//     category: "Lifestyle",
//     description:
//       "Whether you’re in a relationship or single, romantic gifts are always exciting. As we spend more time inside, at home, spicing things up for yourself or with your partner can be difficult. Let’s be honest, if you’re in a relationship during 2020, you can add an extra few years onto your anniversary… Feeling sexy shouldn’t be at the cost of the environment, which is why we love Araks. Not only are their pieces beautiful and comfy, but they are made sustainably and to last. The matching black lace bralette and panty are no brainers because they are ultra-flattering and unlike most lacey materials, they are actually comfortable. A great way to treat yourself and your partner! There should be no embarrassment when it comes to wanting or needing lubricant. Most conventional lubes contain harmful ingredients that should go nowhere near our bodies! To name a few – petroleum, parabens, citric acid, and glycerin, which can increase the chances of getting a yeast infection. No thank you! HANX’s Natural Lubricant is a water-based, vegan, long-lasting, gentle, and paraben free lubricant. It is one of the best natural lubes on the market. Since it is water-based, it doesn’t trap bacteria, making it much more friendly to a woman’s natural balance. Plus, it isn’t sticky and is totally residue free, meaning no mess on your sheets (or wherever else). The perfect stocking stuffer for your significant other!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/12/gifts-for-men-feature-430x580.jpg",
//     title: "24 Sustainable & Considered Christmas Gifts for Men",
//     category: "Lifestyle",
//     description:
//       "We’ve curated some of our favourite conscious gifts for the men in your life – Fathers, husbands, friends and brothers! Whether your guy is already into eco or needs a little help discovering some wonderful new sustainable labels – we are sure you will find something they will love in this guide! Our go-to when it comes to buying for the men in our life – every Haeckels product we have gifted has been loved by our Fathers, husbands, and brothers! Their line of skincare, bodycare and natural lifestyle is sourced and created on the coast line of England’s Margate with seaweed as the hero ingredient. A pioneer in the industry for sustainable innovation, Haeckels have developed biocontributing packaging which means not only does their packaging not harm the planet, but it contributes to our planet’s biosphere. Natural plant incense and ceramic accessories made in England, UME will encourage the men in your life to engage in the wonderful relaxing ritual of incense burning. Pair the uplifting scent of their Dawn incense with the raw black stoneware incense bowl which is on Cora’s husband’s Christmas wish list this year!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/05/laze-at-home-feature-430x580.jpg",
//     title: "Let Yourself Laze: Our Tips for Relaxation at Home",
//     category: "Lifestyle",
//     description:
//       "We at REV truly believe that giving ourselves permission to relax and switch off is hugely important to our health and wellness. This time has been stressful and also has produced deep anxiety about the uncertainty of the future. In this editorial we share with you some of our top tips for relaxing and ‘switching off’ at home. There has been a general consensus that we should use isolation as a time to be extremely productive and take up new hobbies, but we at REV truly believe giving ourselves permission to relax and switch off is just as important – the art of doing nothing can really help with our health. This time has been stressful and also has produced deep anxiety about the uncertainty of the future so relaxation is a wonderful antidote. The last thing we need to be doing is putting even more stress on ourselves by continuing on that treadmill of constantly doing that we were all on before. We highly recommend trying to create a work and play balance in your life right now to keep down our cortisol levels (the stress hormone), which often cause unwanted breakouts, upset tummy and feelings of being overwhelmed. Moving into the future, we believe there is an amazing opportunity to create more harmonious and balanced lives….here are some of our top tips! ",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/reve-en-vert-eco-uk-hotels-feature-430x580.jpg",
//     title: "10 Eco-Friendly Staycation Destinations in the UK",
//     category: "Travel",
//     description:
//       "Lockdown has taught us that we really do not need to travel as much as we have been, not for work and not for holidays. There is so much beauty here in the UK right on our doorstep, possibly just a couple of hours away. If like us, you’re planning on holidaying closer to home, read through our top ten eco hotels and stays in the UK! Located on a quiet beach in Cornwall, The Scarlet Hotel perfectly combines comfort, luxury, and nature. They are one of the most sustainably-minded hotels in the UK and they have a strict sustainability policy. They consider the life cycle of each product and system used within the hotel to ensure they are doing the most to reduce waste and reduce energy usage. The hotel was even built with ecological solutions, such as recyclable materials and waste materials. Each bedroom is thoughtfully designed with organic linens and towels, locally made toiletries, and loo roll made from recycled paper. Their restaurant is a must-try, as all of their dishes are seasonal and made from locally sourced ingredients.  Plus, they have a fantastic organic wine selection! If you have time, make sure to book in for an Ayurvedic treatment in their spa, which uses Cornish ingredients. Check out their list of 111 ways they are sustainable!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/03/guide-london-featured-430x580.jpg",
//     title: "The Sustainable City Guide to East London: Revisited August 2020",
//     category: "Travel",
//     description:
//       "Since East London is home to the REV office and most members of our team, we wanted to share with you some of our favourite consciously minded places in the area that we have discovered. Not only do these places offer some wonderful produce and services, but we believe it is especially important to support local businesses at this time! Here is where we go for natural wine, organic food and reusable goods! Situated on Newington Green, cafe, restaurant and bakery, Jolene offers a spacious, inviting venue whether you are looking for a pastry and coffee or a new date night location. Written by hand on interior blackboards, their small evening menu changes regularly and features dishes for both vegetarians and meat eaters. Passionate about food quality and sustainability, Jolene use mixed wheat populations grown in regenerative ecosystems in their cooking. Be sure to take a keep cup with you if you’re grabbing a coffee to go – they won’t serve you otherwise, and rightly so!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/03/lauren-singer-guide-16-430x580.jpg",
//     title: "Lauren Singer’s Zero Waste Guide to New York City",
//     category: "Travel",
//     description:
//       "‘I would love to say that this guide is a comprehensive NYC guide, but I’m sticking to where I live, Brooklyn, which in my humble opinion is where it’s at! But I’ll sprinkle in a few Manhattan favourites, for good measure.’ Zero waste enthusiast, Lauren Singer is the CEO of online sustainable retail platform, Package Free Shop. Through her blog, Trash Is For Tossers and her social media following, Lauren inspires her readers to live a more zero waste lifestyle just like she does. Read on to learn about her favourite eco spots in New York. I have to start with Food as it is my biggest passion after sustainability and my dog Rose. I like to go to restaurants that have ethical standards that align with my values of sustainability. This means organic and locally sourced ingredients, aspirations for low food waste, and composting. I’ll list them in no specific order. Atoboy<br>There are few, okay, like zero, restaurants that I have been to that have been flawless every time except for this one. To this day, one of my favorite eating experiences was in Korea, and this small plates Korean restaurant never lets me down. It is one of the only reasons I will ever go into Manhattan. I have been here about a dozen times and whether it is my chef friends or best friends, everyone always loves it. I spent New Years Eve here and could not have been happier!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/03/copenhagen-guide-7-430x580.jpg",
//     title: "The Sustainable City Guide to Copenhagen",
//     category: "Travel",
//     description:
//       "Often coined the ‘Happy Capital’, this Scandi Cool city has a ton to offer, from chic architecture and versatile cuisine to enviable street style. It’s also praised as being climate friendly, and ahead of the game with an apparel industry that considers the planet and the population. If you fancy a green getaway and need some inspiration as to what to wear and where to go, this guide’s for you… Famous for its traditional poppy seed rolls and plentiful plant-based dishes (avocado on rye being the most popular choice), the centrally based coffee haven is a must for artisinal brunch lovers. It is also situated right next door to Studio X Viaduct, a design studio selling handcrafted minimalist furnishings, so swing by afterwards for some one-of-a-kind finds. Immerse yourself in Scandinavian design culture by paying a visit to the Design Museum, our favourite innovation spot for everything from transport, to furniture, to fashion.  Follow this with a trip to the 400 year old Rosenborg Castle for some picturesque views. If you’re peckish later on we recommend an afternoon snack at Acacia…in particular their vegan snickers bar (we also advise keeping one in your hotel room fridge for a late night snack!)",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/05/spring-hair-care-feature-430x580.jpg",
//     title: "Our Natural & Organic Hair Care Essentials",
//     category: "Beauty",
//     description:
//       "As we are spending more time indoors, now is a great time to have a closer look at things around your home and make conscious switches to better your health and reduce your carbon footprint. Here Taylor talks you through some the team’s favourite natural hair care alternatives that are not only better for your health, but for the planet too! Soft, shiny, bouncy hair is what we are all after – right? But what is the cost of achieving that? Conventional hair care products are filled with ingredients, that are harmful to us and the planet. A very common ingredient in these conventional products is synthetic fragrances. Most labels simply just say the term, ‘fragrance’, but behind that ingredient is a ton of hidden chemicals used to mimic more expensive natural scents. Since we absorb everything we put on our skin, these chemicals have been found in breast milk and have led to harmful disruptions in the human body. Dimethicone, which is a type of silicone is another common ingredient to avoid. It is actually a type of plastic, which can create a shiny effect on the hair. But really, it creates a buildup of product on the scalp, clogging your pores, and stopping natural moisture and nutrients from entering the pores. Horrible right? ",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/09/st-rose-interview-feature-430x580.jpg",
//     title: "Natural Beauties with Belinda Smith of ST. ROSE Artisan Fragrances",
//     category: "Beauty",
//     description:
//       "The second in our Natural Beauty series, in this editorial we chat with Belinda Smith, founder of natural, sustainable and ethical luxury fragrance line, ST. ROSE. Belinda shares with us her favourite natural beauty rituals, what clean beauty means to her and ST. ROSE, and why opting for a natural fragrance is so important for our health. I feel very lucky to be able to call both Australia and the United States home. Having my first memories of life be draped against the stunning backdrop of the Australian countryside cultivated my love for nature as well as a fascination with the aromatic essences of the Earth’s botanical plants and flowers. My family moved to the United States in 1991 and Circa 91 in our collection is a timeless revel in nostalgia.",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/11/basium-interview-feature-430x580.jpg",
//     title: "Natural Beauties with BASIUM Founder, Constanze Saemann",
//     category: "Beauty",
//     description:
//       "To help celebrate the launch of natural skin and fragrance line BASIUM on our site, we chatted with founder Constanze Saemann all about the creation of the line and the organic hero ingredients used. Constanze shares with us how she navigates a sustainable lifestyle and her natural beauty rituals. The days have been getting colder as we are transitioning into winter so I have begun using my Beau perfume oil. The warming and grounding scent makes it easier to start the day when it’s still dark in the morning. Also, one of my favourite winter rituals is to make myself a cup of herbal tea and put my Terra face mask on because of it’s key ingredient, turmeric, gives my skin a healthy glow and makes me feel fresh again. Even on a grey Berlin day!",
//   },
//   {
//     thumbnail:
//       "https://47awq13mlhod44f65712k455-wpengine.netdna-ssl.com/wp-content/uploads/2020/02/basho-skin-type-feature-430x580.jpg",
//     title: "How to Identify and Care for Your Skin Type with Bashō",
//     category: "Beauty",
//     description:
//       "Contrary to popular belief, Bashō believe that oils play an important role in treating all skin types, even blemish and oily prone. Their range of organic face oils has been thoughtfully tailored to work gently and harmoniously with all skin types. We asked the founders to guide us through how best to identify and treat our skin based on the skin type category it comes under. Biological and hormonal factors include the natural ageing process and all the stages of the menstrual cycle, from menarche to menopause, as well as through puberty and pregnancy. Environmental factors include the effects of seasonal shifts, sun exposure, pollution and air quality. Lifestyle factors include diet, hydration, sleep, exercise, stress + anxiety and smoking. Exposure to toxins and endocrine disruptors – from skin and body care, household cleaning products to the fabrics we wear next to our skin. Now we have a better understanding of our baseline skin types and the areas of our lives which might impact or trigger it’s condition, we can approach the health of our skin more holistically.",
//   },
// ];

app.set("view engine", "ejs");
app.use(cookie());
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOveride("_method"));
app.use("/login", require("./routes/login"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/edit", require("./routes/edit"));
app.use("/loadmore", require("./routes/loadmore"));
app.use("/changethumbnail", require("./routes/changethumbnail"));

app.get("/", async (req, res) => {
  try {
    const thumbnail = await Thumbnail.findOne({ id: 1 });
    const items = await Items.find().sort({ id: -1 }).limit(12);
    res.render("index", { thumbnail: thumbnail, items: items });
  } catch (e) {
    console.log(e);
  }
});

async function findItems(category, subArray) {
  try {
    let items = [];
    for (let i = 0; i < subArray.length; i++) {
      let itemm = await Items.find({
        $and: [{ category: category, sub_category: subArray[i] }],
      })
        .limit(4)
        .sort({ id: -1 });
      items.push(...itemm);
    }
    return items;
  } catch (e) {
    res.send("Internal Server Error");
  }
}

app.get("/lifestyle", async (req, res) => {
  try {
    let sub = [
      "Clothing",
      "Home",
      "Beauty & Skincare",
      "Accessories",
      "Bath & Body",
      "Jewelry",
      "Kids",
    ];
    let items = await findItems("lifestyle", sub);
    res.render("lifestyle", { items: items });
  } catch (e) {
    res.send(e.message);
  }
});

app.get("/gifts", async (req, res) => {
  let sub = ["GIFTS FOR HER", "GIFTS FOR HIM"];
  let items = await findItems("gift", sub);
  res.render("gifts", { items: items });
});

app.get("/stories", async (req, res) => {
  try {
    const items = await Blog.find().sort({ Date: -1 });
    res.render("stories", { items: items });
  } catch (e) {
    res.send(e.message);
  }
});

app.get("/stories/:story", (req, res) => {
  let ttl = req.params.story;
  top_items.forEach(item => {
    if (item.title == ttl) {
      res.render("single-story", { story: item });
    }
  });
  items.forEach(item => {
    if (item.title == ttl) {
      res.render("single-story", { story: item });
    }
  });
  res.send("404 not found");
});

app.get("/experiences", async (req, res) => {
  let sub = [
    "Europe",
    "Africa",
    "Asia",
    "America",
    "Antarctica",
    "Australasia",
  ];
  let items = await findItems("experience", sub);
  res.render("experiences", { items: items });
});

app.get("/shobycause", (req, res) => {
  res.render("shopbycause", { items: [] });
});

app.get("/addstory", verify, (req, res) => {
  res.render("add-story");
});

app.get("/:name", (req, res) => {
  res.send("404 not found");
});

// app.get("/register",async (req,res)=>{
//   try{
//
//   const username = "aida";
//   let password = "Myaccount1";
//   const salt = await bycrypt.genSalt(10);
//   password = await bycrypt.hash(password,salt);
//
//   const user = new User({
//     username : username,
//     password : password
//   })
//
//   user.save();
//   res.redirect("/login")
// }
// catch(e){
//   res.send(e.message);
// }
// })

//
//
// 1 clothin
// 2 beauty&skin
// 3 bath
// 4 Remove thera
// 5 acces
// 6 home
// 7 Books
// 8 kid

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
