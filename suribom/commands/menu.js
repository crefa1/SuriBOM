const readline = require('readline');
const { banAll, channelSpam, muteAll, allInOne, listenStop } = require('../utils/actions');

module.exports = {
  name: 'menu',
  description: 'İşlem menüsü',
  execute: async (client, config) => {
    listenStop();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('\nNe yapmak istiyorsun?');
    console.log('1) Bütün kullanıcıları banla');
    console.log('2) Kanal açıp everyone etiketle (banlanana kadar)');
    console.log('3) Herkesi sustur, tüm kanallara mesaj atıp everyone etiketle, rolleri sil, yeni roller oluştur (banlanana kadar)');
    console.log('4) Hepsini aynı anda yap');
    rl.question('Seçiminiz (1-4): ', async (answer) => {
      if(answer === '2') {
        rl.question('Kanal adı ne olsun? ', (channelName) => {
          rl.question('Kanalda ne yazılsın? ', (msg) => {
            channelSpam(client, config, channelName, msg);
            rl.close();
          });
        });
      } else if(answer === '3' || answer === '4') {
        rl.question('Tüm kanallara atılacak mesajı yazın: ', (msg) => {
          rl.question('Oluşturulacak yeni rolün adını yazın: ', (rolename) => {
            if(answer === '3') muteAll(client, config, msg, rolename);
            else if(answer === '4') {
              rl.question('Kanal adı ne olsun? ', (channelName) => {
                allInOne(client, config, msg, rolename, channelName);
                rl.close();
              });
            } else {
              rl.close();
            }
          });
        });
      } else {
        switch(answer) {
          case '1':
            await banAll(client, config);
            break;
          default:
            console.log('Geçersiz seçim!');
        }
        rl.close();
      }
    });
  }
}; 