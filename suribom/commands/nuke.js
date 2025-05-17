const readline = require('readline');
const { allInOne } = require('../utils/actions');
const config = require('../config.json');

module.exports = {
  name: 'nuke',
  description: 'Sunucuda tüm işlemleri başlatır.',
  execute: async (message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('Bu komutu kullanmak için yetkin yok!');
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Tüm kanallara atılacak mesajı yazın: ', (msg) => {
      rl.question('Oluşturulacak yeni rolün adını yazın: ', (rolename) => {
        allInOne(message.client, config, msg, rolename);
        rl.close();
      });
    });
  }
}; 