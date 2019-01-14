var mongoose = require( 'mongoose' );
var dbURI = 'mongodb://<guldali>:<guldali.97>@ds157064.mlab.com:57064/mekanbul';
//var dbURI = 'mongodb://localhost/mekanbul'; // localhost için tamam burada hoca eklemiş sağolsun :D 

mongoose.connect(dbURI, { 'useMongoClient': true }); 
//Bağlandığında konsola bağlantı bilgilerini yazdır.
mongoose.connection.on('connected', function () {
  console.log('Mongoose ' + dbURI+ 
    ' adresindeki veritabanına bağlandı\n');
});
//Bağlantı hatası olduğunda konsola hata bilgisini yazdır
mongoose.connection.on('error',function (err) {
  console.log('Mongoose bağlantı hatası\n: ' + err);
});
//Bağlantı  kesildiğinde konsola kesilme bilgisini yaz.
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose bağlantısı kesildi\n');
});

kapat = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose kapatıldı\n ' + msg);
        callback();
    });
};// nodemon kullanıyorsanız ayrı bir kapatma işlemi gerekir.
process.once('SIGUSR2', function() {
    kapat('nodemon kapatıldı\n', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});// Uygulama kapandığında kapat.
process.on('SIGINT', function() {
    kapat('Uygulama kapatıldı\n', function() {
        process.exit(0);
    });
});// Herokudan kapatma işlemi gerçekleşirse
process.on('SIGTERM', function() {
    kapat('heroku kapatıldı\n', function() {
        process.exit(0);
    });
});
require('./mekansema'); 
