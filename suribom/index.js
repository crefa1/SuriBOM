// SuriBOM botu
const blue = '\x1b[34m';
const reset = '\x1b[0m';

console.log(blue + `
 /$$$$$$  /$$   /$$ /$$$$$$$  /$$$$$$ /$$$$$$$   /$$$$$$  /$$      /$$
 /$$__  $$| $$  | $$| $$__  $$|_  $$_/| $$__  $$ /$$__  $$| $$$    /$$$
| $$  \__/| $$  | $$| $$  \ $$  | $$  | $$  \ $$| $$  \ $$| $$$$  /$$$$
|  $$$$$$ | $$  | $$| $$$$$$$/  | $$  | $$$$$$$ | $$  | $$| $$ $$/$$ $$
 \____  $$| $$  | $$| $$__  $$  | $$  | $$__  $$| $$  | $$| $$  $$$| $$
 /$$  \ $$| $$  | $$| $$  \ $$  | $$  | $$  \ $$| $$  | $$| $$\  $ | $$
|  $$$$$$/|  $$$$$$/| $$  | $$ /$$$$$$| $$$$$$$/|  $$$$$$/| $$ \/  | $$
 \______/  \______/ |__/  |__/|______/|_______/  \______/ |__/     |__/
                                                                       
` + reset);

const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const menu = require('./commands/menu');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot giriş yaptı: ${client.user.tag}`);
  menu.execute(client, config);
});

client.login(config.token); 