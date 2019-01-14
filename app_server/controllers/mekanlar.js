//anaSayfa controller metodu
//index.js dosyasındaki router.get('/',ctrlMekanlar.anaSayfa);
//ile metot url'ye bağlanıyor
//API'ye bağlanabilmek için request modulünü ekle
var request = require('request');
//api seçeneklerini ayarla
//Eğer üretim ortamında çalışıyorsa herokudan al
//Lokalde çalışıyorsa localhost varsayılan sunucu
var apiSecenekleri = {

  sunucu : "http://localhost:3000",
  apiYolu: '/api/mekanlar/'
};
if (process.env.NODE_ENV === 'production') {
  apiSecenekleri.sunucu = "https://guldali.herokuapp.com";
}

const mongoose = require('mongoose');
const mekan = mongoose.model('mekan');


var mesafeyiFormatla = function (mesafe) {
  var yeniMesafe, birim;
  if (mesafe> 1) {
    yeniMesafe= parseFloat(mesafe).toFixed(1);
    birim = 'km';
  } else {
    yeniMesafe = parseInt(mesafe * 1000,10);
    birim = 'm'; 
  }
    return yeniMesafe + birim;
  };

var anaSayfaOlustur = function(req, res,cevap, mekanListesi,pug_,baslik_,siteAd_,aciklama_){
  var mesaj;
//Gelen mekanListesi eğer dizi tipinde değilse hata ver.
if (!(mekanListesi instanceof Array)) {
  mesaj = "API HATASI: Birşeyler ters gitti";
  mekanListesi = [];
} else {//Eğer belirlenen mesafe içinde mekan bulunamadıysa bilgilendir
  if (!mekanListesi.length) {
    mesaj = "Civarda Herhangi Bir Mekan Bulunamadı!";
  }
}
res.render(pug_, 
  { 
  baslik: baslik_,
  sayfaBaslik:{
    siteAd:siteAd_,
    aciklama:aciklama_
  },
  mekanlar:mekanListesi,
  mesaj: mesaj,
  cevap:cevap
});
};

const adminSayfa=function(req,res){
  var istekSecenekleri;
    istekSecenekleri = 
    {//tam yol
    url : apiSecenekleri.sunucu +  "/api/tummekanlar",
    //Veri çekeceğimiz için GET metodunu kullan
    method : "GET",
    //Dönen veri json formatında olacak
    json : {}
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap, mekanlar) {
      var i, gelenMekanlar;
      gelenMekanlar = mekanlar;
      //Sadece 200 durum kodunda ve mekanlar doluyken işlem yap
      if (!hata && gelenMekanlar.length) {
        for (i=0; i<gelenMekanlar.length; i++) {
          gelenMekanlar[i].mesafe = 
          mesafeyiFormatla(gelenMekanlar[i].mesafe);
        }
      }
      anaSayfaOlustur(req, res, cevap,gelenMekanlar,"admin","MekanBul-Admin","MekanBul-Admin","Mekanları Yönetin");
    } 
  );
} 


const mekanEkle= function (req, res) {
res.render("mekanekle", 
  { 
  baslik: "Yeni Mekan Ekle",
  sayfaBaslik:{
    siteAd:"Yeni Mekan Ekle",
    aciklama:""
  }
});


};


const mekaniEkle= function (req, res) {
  var istekSecenekleri, gonderilenMekan;
  gonderilenMekan = {
    ad: req.body.mekanAdi,
    adres: req.body.mekanAdresi,
    imkanlar: req.body.imkanlar,
    enlem: req.body.enlem,
    boylam: req.body.boylam,
    gunler1: req.body.gunler1,
    acilis1: req.body.acilis1,
    kapanis1: req.body.kapanis1,
    gunler2: req.body.gunler2,
    acilis2: req.body.acilis2,
    kapanis2: req.body.kapanis2
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ apiSecenekleri.apiYolu,
    method : "POST",
    json : gonderilenMekan
  };
 /* if (!gonderilenMekan.yorumYapan || !gonderilenMekan.puan || !gonderilenMekan.yorumMetni) {
    res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet'); 
  } else { */
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (cevap.statusCode === 201) {
          res.redirect('/mekan/' + body._id);
        }
        else {
          hataGoster(req, res, cevap.statusCode);
        } 
      }
      );
    //}



};



const mekanSil= function (req, res) {

  var mekanid = req.params.mekanid;
    var istekSecenekleri;
    

  if (mekanid) {
  istekSecenekleri = 
    {//tam yol
    url : apiSecenekleri.sunucu + '/api/mekanlar/'+mekanid,
    //Veri çekeceğimiz için GET metodunu kullan
    method : "DELETE",
    //Dönen veri json formatında olacak
    json : {}
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap) {
      res.redirect('/admin');
    } 
  );   


  } else {
    hataGoster(req,res,"","Boş alan mevcut");

  }


};
const mekanGuncelle = function (req, res, callback) {
  mekanBilgisiGetir(req, res, function(req, res, cevap) {
   guncelleSayfasiOlustur(req, res, cevap);
 });
};



// gonder postu bebeğim
const mekaniGuncelle = function (req, res, callback) {
   var mekanid = req.params.mekanid;
  var istekSecenekleri, gonderilenMekan;
  gonderilenMekan = {
    ad: req.body.mekanAdi,
    adres: req.body.mekanAdresi,
    imkanlar: req.body.imkanlar,
    enlem: req.body.enlem,
    boylam: req.body.boylam,
    gunler1: req.body.gunler1,
    acilis1: req.body.acilis1,
    kapanis1: req.body.kapanis1,
    gunler2: req.body.gunler2,
    acilis2: req.body.acilis2,
    kapanis2: req.body.kapanis2
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ "/api/mekanlar/"+mekanid,
    method : "PUT",
    json : gonderilenMekan
  };
 /* if (!gonderilenMekan.yorumYapan || !gonderilenMekan.puan || !gonderilenMekan.yorumMetni) {
    res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet'); 
  } else { */
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (cevap.statusCode === 200) {
          res.redirect('/admin');
        }
        else {
          hataGoster(req, res, cevap.statusCode);
        } 
      }
      );
    //}






};

var guncelleSayfasiOlustur = function(req, res,mekanDetaylari){
  var imkanlar = '';
  for (var i = mekanDetaylari.imkanlar.length - 1; i >= 0; i--) {
    imkanlar += mekanDetaylari.imkanlar[i]+" "
  }
 res.render('mekan-guncelle', 
 { 
  baslik: mekanDetaylari.ad,
  sayfaBaslik: mekanDetaylari.ad + " Mekanını Güncelle",
  mekanBilgisi:mekanDetaylari,
  imkanlar:imkanlar.trim()
});
}





const anaSayfa=function(req,res){
  var istekSecenekleri;
    istekSecenekleri = 
    {//tam yol
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu,
    //Veri çekeceğimiz için GET metodunu kullan
    method : "GET",
    //Dönen veri json formatında olacak
    json : {},
    //Sorgu parametreleri.URL'de yazılan enlem boylamı al
    //localhost:3000/?enlem=37&boylam=30 gibi
    qs : {
      enlem :  req.query.enlem,
      boylam : req.query.boylam
    }
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap, mekanlar) {
      var i, gelenMekanlar;
      gelenMekanlar = mekanlar;
      //Sadece 200 durum kodunda ve mekanlar doluyken işlem yap
      if (!hata && gelenMekanlar.length) {
        for (i=0; i<gelenMekanlar.length; i++) {
          gelenMekanlar[i].mesafe = 
          mesafeyiFormatla(gelenMekanlar[i].mesafe);
        }
      }
      anaSayfaOlustur(req, res, cevap,gelenMekanlar,"mekanlar-liste","MekanBul-Yakınındaki Mekanları Bul","MekanBul","Yakınınızdaki Kafeleri, Restorantları Bulun!");
    } 
  );
}


var detaySayfasiOlustur = function(req, res,mekanDetaylari){
 res.render('mekan-detay', 
 { 
  baslik: mekanDetaylari.ad,
  sayfaBaslik: mekanDetaylari.ad,
  mekanBilgisi:mekanDetaylari
});
}
var hataGoster = function(req, res,durum,ileti){
  var baslik,icerik;
  if(durum==404){
    baslik="404, Sayfa Bulunamadı!";
    icerik="Kusura bakma sayfayı bulamadık!";
  }
  else{
     baslik=durum+", Birşeyler ters gitti!";
     icerik="Ters giden birşey var!";
  }

  if(ileti){
    baslik="Uppsss!";
    icerik=ileti;
  }
 res.status(durum);
 res.render('hata',{
    baslik:baslik,
    icerik:icerik
 });
};

var mekanBilgisiGetir = function (req, res, callback) {
  var istekSecenekleri;
  //istek seçeneklerini ayarla.
  istekSecenekleri = {
    //tam yol
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,
    //Veri çekeceğimiz için GET metodunu kullan
    method : "GET",
    //Dönen veri json formatında olacak
    json : {}
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap, mekanDetaylari) {
      var gelenMekan = mekanDetaylari;
      if (!hata) {
        //enlem ve boylam bir dizi şeklinde bunu ayır. 
        //0'da enlem 1 de boylam var
        gelenMekan.koordinatlar = {
          enlem : mekanDetaylari.koordinatlar[0],
          boylam : mekanDetaylari.koordinatlar[1]
        };
        callback(req, res,gelenMekan);

      } else {
        hataGoster(req, res, cevap.statusCode);
      }
    }
    ); 
};


//mekanBilgisi controller metodu
//index.js dosyasındaki router.get('/mekan', ctrlMekanlar.mekanBilgisi);
//ile metot url'ye bağlanıyor
const mekanBilgisi = function (req, res, callback) {
  mekanBilgisiGetir(req, res, function(req, res, cevap) {
   detaySayfasiOlustur(req, res, cevap);
 });
};
var yorumSayfasiOlustur = function (req, res, mekanBilgisi) {
  res.render('yorum-ekle', { baslik: mekanBilgisi.ad+ ' Mekanına Yorum Ekle',
    sayfaBaslik:mekanBilgisi.ad+ ' Mekanına Yorum Ekle' ,
    hata: req.query.hata
  });
};
//yorumEkle controller metodu
//index.js dosyasındaki router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
//ile metot url'ye bağlanıyor
const yorumEkle=function(req,res){
  mekanBilgisiGetir(req, res, function(req, res, cevap) {
   yorumSayfasiOlustur(req, res, cevap);
 });
}
//yorumumuEkle controller metodu
//index.js dosyasındaki router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumumuEkle);
//ile metot url'ye bağlanıyor
const yorumumuEkle = function(req, res){
  var istekSecenekleri, gonderilenYorum,mekanid;
  mekanid=req.params.mekanid;
  gonderilenYorum = {
    yorumYapan: req.body.name,
    puan: parseInt(req.body.rating, 10),
    yorumMetni: req.body.review
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ apiSecenekleri.apiYolu+mekanid+'/yorumlar',
    method : "POST",
    json : gonderilenYorum
  };
  if (!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni) {
    res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet'); 
  } else { 
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (cevap.statusCode === 201) {
          res.redirect('/mekan/' + mekanid);
        } 
        else if (cevap.statusCode === 400 && body.name && body.name ==="ValidationError" ) {
          res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet'); 
        }
        else {
          hataGoster(req, res, cevap.statusCode);
        } 
      }
      );
    }
  };
//metotlarımızı kullanmak üzere dış dünyaya aç
//diğer dosyalardan require ile alabilmemizi sağlayacak
module.exports = {
adminSayfa,
mekanEkle,
mekaniEkle,
mekanSil,
mekanGuncelle,
mekaniGuncelle,
anaSayfa,
mekanBilgisi,
yorumEkle,
yorumumuEkle
};