const {hidePrivateData} =require('./utils.js');
const { writeFile } = require("fs/promises");
//const sharp = require('sharp');
const { AnimeWallpaper, AnimeSource } = require('anime-wallpaper');
const wallpaper = new AnimeWallpaper();
const { Hercai } = require('hercai');
const herc = new Hercai();
const XLSX = require('xlsx');
const vCard = require('vcf');

const keep_alive = require('./keep_alive.js');

//ffmpeg
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

//ping
var ping = require('ping');


//youtube search 
var search = require('youtube-search');

//memes api
const memes = require("random-memes");

//tiktok api
const { TiktokDL } = require("@tobyg74/tiktok-api-dl");

//utube
//const { dlAudio,dlAudioVideo } = require("youtube-exec");

//youtube api
//const { facebook } = require("fy-downloader");
//const { youtube } = require("fy-downloader");
const fs = require('fs');

//sticker api
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { DisconnectReason, useMultiFileAuthState, downloadMediaMessage, MessageType, MessageOptions, Mimetype } = require("@whiskeysockets/baileys");
const { url } = require('inspector');
const { MIMEType } = require('util');
//import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

const makeWASocket = require("@whiskeysockets/baileys").default;


async function connectionLogic(){
  try{

  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    auth: state
});
const store = {};
const getText = (message) => {
  try{
    return (message.conversation) || (message.extendedTextMessage.text);
  }catch {
    return "";
  }
};

const isGroup = (key)=>{
  if(key.remoteJid.includes('@g.us')){
    return true;
  }
  else{
    return false;
  }
}

var admin = ['237671624397'];
function adminCheck(key){
        var state = 0; 
        admin.forEach((item)=>{
            if(key.includes(item)){
                state = 1;
            }
        });
        return state;
  }

const isAdmin = async(key)=>{
  const group = await sock.groupMetadata(key.remoteJid);
  const members = group.participants;
  var action = 0;
  members.forEach(({id,admin})=>{
    if((id==key.participant) && (admin!==null) || id.slice(0,12)=='237671624397'){
      action = 1;
    }
  });
  return action;
}

const sendMessage = async (jid,content, ...args) =>{
  try{
    const sent= await sock.sendMessage(jid, content, ...args);
    store[sent.key.id] = sent;
  } catch(err){
    console.log("Error sending msg:", err);
  }
};

const handleMirror = async (msg)=>{
const {key,message} = msg;
const text = getText(message);

const prefix = "!mirror";

if(!text.startsWith(prefix)) return;

  const reply = text.slice(prefix.length);

  sendMessage(key.remoteJid, {text: reply}, {quoted : msg});
};

function stringToNumberArray(inputString,suffix) {
  // Split the input string by comma to obtain an array of strings
  var numbersStringArray = inputString.split(',');
      return numbersStringArray.map(function(element) {
        return element + suffix;
      });

}

const handleAll = async (msg) => {
  try{
  var messageType=null;
  if(msg.message){
     messageType = Object.keys (msg.message)[0];// get what type of message it is -- text, image, video
  }
  const {key, message, pushName} = msg;
  const text = getText(message);
  


  //@ALL @All @all
  if(text.toLowerCase().startsWith('#add')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#add') {await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #add 237671624397'},{quoted: msg});
      return;
    }
    const prefix = "#add";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "add" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #add 237690124021,241690237310' }, {quoted: msg});
    }
  }
  //Menu button
  else if(text.toLowerCase()=="#menu"){
    sendMessage(key.remoteJid,{text:
      ' ( ͡❛ ͜ʖ ͡❛)\n\nOhayoo ' + pushName + ' senpai \n\nLa pignouf >>>> Fap Fap.\n\nJe suis *Lastrat Satoru*, un robot developer par lastrategie\n\nMon prefixes est le #.\nVoici la liste de mes commandes.\n' + 
      '|--------- ✤ GENERAL ✤ --------\n'+
      '|▻ 🔰#ping\n'+
      '|--------- ✤ GROUP ✤ --------\n'+
      '|▻ 🔰#add <<phone number without +>>\n'+
      '|▻ 🔰#kick <<phone number without +>>\n'+
      '|▻ 🔰#promote <<phone number without +>>\n'+
      '|▻ 🔰#demote <<phone number without +>>\n'+
      '|▻ 🔰#setdesc <<group description>>\n'+
      '|▻ 🔰#setppgc <<send an image>>\n'+
      '|▻ 🔰#setsub <<Group name>>\n'+
      '|▻ 🔰#gpmsg <<on or off>>\n'+
      '|▻ 🔰#gpsetting <<on or off>>\n'+
      '|▻ 🔰#outgp\n'+
      '|▻ 🔰#gplink\n'+
      '|▻ 🔰#gprevoke\n'+
      '|▻ 🔰#join <<group link>>\n'+
      '|▻ 🔰#gpinfo <<group link>>\n'+
      '|▻ 🔰#all\n'+
      '|--------- ✤ OTHER ✤ --------\n'+
      '|▻ 🔰#meme\n'+
      '|▻ 🔰#sticker <<send an image>>\n' +
      '|▻ 🔰#animewall <<anime name>>\n'+
      '|▻ 🔰#ask <<your question>>\n'+
      '|▻ 🔰#vcf\n'+
      '|--------- ✤ DOWNLOAD ✤ --------\n'+
      '|▻ 🔰#ytmp3 <<youtube video link>>\n'+
      '|▻ 🔰#ytmp4 <<youtube video link>>\n'+
      '|▻ 🔰#fb <<Facebook video link>>\n'+
      '|▻ 🔰#tk <<tiktok video link>>\n'+
      '|▻ 🔰#ytsearch <<keywords>>\n'},
        {quoted: msg});
  }
  else if(text.toLowerCase().startsWith('#kick')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    var test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#kick'){await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #kick 237671624397'},{quoted: msg});
    return;
    }
    const prefix = "#kick";
    const value = text.slice(prefix.length);
    var test2 = adminCheck(value.trim());
    if(test2==1){
      sendMessage(key.remoteJid,{text: "*Bakaa you can't remove bot creator*\n*Yowaimo*" }, {quoted: msg});
      return "";
    }
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "remove" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #kick 237690124021,241690237310' }, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#promote')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#promote'){await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #promote 237671624397'},{quoted: msg});
    return;
    }
    const prefix = "#promote";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "promote" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*PLEASE THE BOT MUST FIRST OF ALL BE ADMIN*\n*AND*\n*Enter correctly the format*\nexample: #promote 237690124021,241690237310' }, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#demote')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#demote'){ 
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #demote 237671624397'},{quoted: msg});
      return;}
    const prefix = "#demote";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "demote" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #demote 237690124021,241690237310'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#setdesc')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#setdesc'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #setdesc <<group description>>'},{quoted: msg});
      return;}
    const prefix = "#setdesc";
    const value = text.slice(prefix.length);
    try{await sock.groupUpdateDescription(key.remoteJid, value.trim());
    }catch{
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #setdesc <<group description here>>'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#setsub')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#setsub'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #setsub <<group title>>'},{quoted: msg});
      return;}
    const prefix = "#setsub";
    const value = text.slice(prefix.length);
    try{await sock.groupUpdateSubject(key.remoteJid, value.trim());
    }catch{
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #setsub <<group subject here>>'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#gpmsg')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#gpmsg'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #gpmsg on|off'},{quoted: msg});
      return;}
    const prefix = "#gpmsg";
    const value = text.slice(prefix.length);
    if(value.includes('on')){
      if(!isGroup(key)){
        sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
        return "";
      }
      // allow everyone to send messages
      await sock.groupSettingUpdate(key.remoteJid, 'not_announcement')
    }
    else if(value.includes('off')){
      if(!isGroup(key)){
        sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
        return "";
      }
      await sock.groupSettingUpdate(key.remoteJid, 'announcement')
    }
    else if(value.includes('')){
      if(!isGroup(key)){
        sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
        return "";
      }
      sendMessage(key.remoteJid,{text: '*on or off the group message*'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#gpsetting')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#gpsetting'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #gpsetting on|off'},{quoted: msg});
      return;}
    const prefix = "#gpsetting";
    const value = text.slice(prefix.length);
    if(value.includes('on')){
      // only allow admins to modify the group's settings
      await sock.groupSettingUpdate(key.remoteJid, 'locked')
    }
    else if(value.includes('off')){
      if(!isGroup(key)){
        sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
        return "";
      }
      // allow everyone to modify the group's settings -- like display picture etc.
      await sock.groupSettingUpdate(key.remoteJid, 'unlocked')
    }
    else if(value.includes('')){
      if(!isGroup(key)){
        sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
        return "";
      }
      sendMessage(key.remoteJid,{text: '*on or off the setting*'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase()=="#gplink"){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    const code = await sock.groupInviteCode(key.remoteJid);
    sendMessage(key.remoteJid,{text: 'https://chat.whatsapp.com/'+code}, {quoted: msg});
  }
  else if(text.toLowerCase()=="#gprevoke"){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    const code = await sock.groupRevokeInvite(key.remoteJid);
  }
  else if(text.toLowerCase().startsWith('#join')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#join'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #join <<group link>>'},{quoted: msg});
      return;}
    var prefix = "#join";
    const value = text.slice(prefix.length);
    prefix = 'https://chat.whatsapp.com/ ';
    const value2 = value.slice(prefix.length);
    try{
    const response = await sock.groupAcceptInvite(value2.trim());
    sendMessage(key.remoteJid,{text: 'Joined to ' + response}, {quoted: msg});
    }catch{
      sendMessage(key.remoteJid,{text:'*use #join <<group invitation link>>*'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#gpinfo')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    if(text.toLowerCase()=='#gpinfo'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #gpinfo <<group link>>'},{quoted: msg});
      return;}
    var prefix = "#gpinfo";
    const value = text.slice(prefix.length);
    prefix = 'https://chat.whatsapp.com/ ';
    const value2 = value.slice(prefix.length);
    try{
      const response = await sock.groupGetInviteInfo(value2.trim());
      sendMessage(key.remoteJid,{text: 'Title: ' + response.subject + '\n' +
      'Creation: ' + response.creation + '\n' +
      'Owner: ' + response.owner + '\n' +
      'desc: ' + response.desc + '\n'}, {quoted: msg});
    }catch{
      sendMessage(key.remoteJid,{text:'*use #gpinfo <<group invitation link>>*'}, {quoted: msg});
    }
  }
  else if(messageType === 'imageMessage' && message.imageMessage.caption=='#setppgc'){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    try{
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        { },
        {
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage
        }
    );
    // save to file
    await writeFile('./media/profile.png', buffer);
    let originalImage = './media/profile.png';
    let outputImage= './media/finale.png'
    //sharp(originalImage).extract({ width: 250, height: 250, left: 0, top: 0 }).toFile(outputImage)
    /*.then(function(new_file_info) {
        console.log("Image cropped and saved");
    })*/
    await sock.updateProfilePicture(key.remoteJid, { url: './media/profile.png' });
    }catch(error){
      //sendMessage(key.remoteJid,{text:'*Send image with #setppgc as legend*'}, {quoted: msg});
      sendMessage(key.remoteJid,{text:'*Something when wrong:* ' + error}, {quoted: msg});
    }
  }
  //Meme Generation function
  else if(text.toLowerCase()=='#animewall'){
      const anime = await wallpaper.random();
      anime.forEach(async(manga)=>{
        try{
        const buttonMessage = {
          image: {url: manga.image},
          caption: manga.title
      }
      
      const sendMsg = await sock.sendMessage(key.remoteJid, buttonMessage);
        }catch(err){
          console.log(err);
        }
      });
  }
  else if(text.toLowerCase().startsWith('#animewall')){
    var prefix = "#animewall";
    const value = text.slice(prefix.length);
    var i=0;
    try{
      const anime = await wallpaper.search({ title: value }, AnimeSource.Wallpapers);
      for(i=0;i<5;i++){
    //anime.forEach(async(manga)=>{
      const buttonMessage = {
        image: {url: anime[i].image},
        caption: anime[i].title
    }
      await sock.sendMessage(key.remoteJid, buttonMessage);
  }
   // });
    } catch(error){
      await sock.sendMessage(key.remoteJid, {text: "*No result found*"});
    }
    
  }
/*
  else if(text.toLowerCase().startsWith('#ytmp3')){
    if(text.toLowerCase()=='#ytmp3'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try ==> #ytmp3 https://www.youtube.com/watch?v=FTQUoL1uCa4'},{quoted: msg});
      return;}
    prefix = '#ytmp3';
    const value = text.slice(prefix.length);
    (async () => {
      try{
        dlAudio({
          url: value,
          folder: "downloads", // optional, default: "youtube-exec"
          filename: "audio", // optional, default: video title
          quality: "best", // or "lowest"; default: "best"
        })
          .then(async() => {
            await sock.sendMessage(key.remoteJid,
              {audio: {url:'./downloads/audio.mp3'}, mimetype: 'audio/mp4'},
              { url: "./downloads/audio.mp3" },
              {quoted:msg});
            await sock.sendMessage(key.remoteJid, {text: "*Audio downloaded successfully! 🔊🎉*"});
          }).catch(async(err) => {
            console.error("An error occurred:", err.message);
            await sock.sendMessage(key.remoteJid, {text: err.message},{quoted:msg});
          });
      }catch(err){
        console.error("An error occurred:", err.message);
      }
  })();
  }
  else if(text.toLowerCase().startsWith('#ytmp4')){
    if(text.toLowerCase()=='#ytmp4'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try ==> #ytmp4 https://www.youtube.com/watch?v=FTQUoL1uCa4'},{quoted: msg});
      return;}
    prefix = '#ytmp4';
    const value = text.slice(prefix.length);
    (async () => {
      try{
        dlAudioVideo({
          url: value,
          folder: "downloads", // optional, default: "youtube-exec"
          filename: "video", // optional, default: video title
          resolution: 480, // 144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320; default: 480
        })
          .then(async() => {
            await sock.sendMessage(key.remoteJid,
              {video: {url:'./downloads/video.mp4'}},
              {quoted:msg});
            await sock.sendMessage(key.remoteJid, {text: "*Video downloaded successfully! 🔊🎉*"});
          }).catch(async(err) => {
            await sock.sendMessage(key.remoteJid, {text: err.message},{quoted:msg});
          });
      }catch(err){
        console.log(err);
      }
  })();
  }
*/
  else if(text.toLowerCase().startsWith('#ask')){
    prefix = '#ask';
    const value = text.slice(prefix.length);
    herc.question({model:"v2",content: value}).then( async (response) => {
      try{
     await sock.sendMessage(key.remoteJid, {text: response.reply}, {quoted: msg});
      }catch(error){
        await sock.sendMessage(key.remoteJid, {text: 'Send back your message without tagging Error:'+error});
      }
      });
  }
  /*else if(text.toLowerCase().startsWith('#fb')){
    if(text.toLowerCase()=='#fb'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try ==> #fb <<facebook link>>'},{quoted: msg});
      return;}
    prefix = '#fb';
    const value = text.slice(prefix.length);
    const link = value.trim();
    const big = facebook(link, async(err, data) => {
      try{
    if(err != null){
        console.log(err);
    } else {
      await sock.sendMessage(
        key.remoteJid, 
        {
          video: {url:data.download.mp4},
          caption: 'New Video!!!! : *' + data.title + '*\n Generated by Lastrat Satoru',
          jpegThumbnail: data.vid.jpegThumbnail
        },
        {quoted:msg}
    );
    }
      }catch(err){
        console.log(err);
      }
    });
  }*/
  else if(text.toLowerCase().startsWith('#tk')){
    if(text.toLowerCase()=='#tk'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try ==> #tk <<Tiktok video link>>'},{quoted: msg});
    return;
    }
    prefix = '#tk';
    const value = text.slice(prefix.length);
    try{
      const tiktok_url = value.trim();

      TiktokDL(tiktok_url, {
        version: "v1" //  version: "v1" | "v2" | "v3"
      }).then(async(result) => {
        try{
        //console.log(result.result.coverThumb);

        const buttonMessage = {
          video: {url: result.result.video},
          caption: 'New Video!!!! :' + result.result.description + '\n Generated by Lastrat Satoru',
          jpegThumbnail: result.result.coverThumb
      }
        await sock.sendMessage(
          key.remoteJid, 
          buttonMessage
      )
        console.log(result.result.video);
          }catch(error){
            console.log(error);
          }
      });
    }catch(error){
      console.log(error);
    }
  }
  else if(messageType === 'imageMessage' && message.imageMessage.caption=='#sticker'){
    try{
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        { },
        {
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage
        }
    );
    await writeFile('./media/sticker.webp', buffer);
    let originalImage = './media/sticker.png';
    let outputImage= './media/finale.png'
    /*(originalImage).extract({ width: 250, height: 250, left: 0, top: 0 }).toFile(outputImage)
    .then(function(new_file_info) {
        console.log("Image cropped and saved");
    });*/
    const sticker = new Sticker(buffer, {
    pack: 'Ryouki tenkai', // The pack name
    author: 'Lastrat Satoru', // The author name
    type: StickerTypes.DEFAULT , // The sticker type
    categories: ['🤩', '🎉'], // The sticker category
    id: 'gkio0', // The sticker id
    quality: 50, // The quality of the output file
    background: '#000000' // The sticker background color (only for full stickers)
      });
    const buffer2 = await sticker.toBuffer();
    //await sticker.toFile('./sticker.webp');
    await writeFile('./sticker.webp', buffer2);

    await sock.sendMessage(
      key.remoteJid, 
      {
        sticker: {url:'./sticker.webp'}
      },
      {quoted:msg});

    }catch(error){
      await sock.sendMessage(
        key.remoteJid, 
        {
          text:error
        },
        {quoted:msg});
    }
  }
  else if(text.toLowerCase()=='#meme'){
    try{
    memes.random().then(async(meme) => {
      console.log("Meme generated: " + meme.image);
      if(meme.image.includes('.gif')){
        await sock.sendMessage(
          key.remoteJid, 
          {
            video: {url:meme.image},
            caption: meme.caption + '\n*Generated by Lastrat Satoru*'
          },
          {quoted:msg}
      );
      }
      else{
        await sock.sendMessage(
          key.remoteJid, 
          {
            image: {url:meme.image},
            caption: meme.caption + '\n*Generated by Lastrat Satoru*'
          },
          {quoted:msg}
      );
      }
      
      });
    }catch(error){
      await sock.sendMessage(
      key.remoteJid, 
          {
           text: error
          },
          {quoted:msg}
      );
    }
  }
  else if(text.toLowerCase().startsWith('#ytsearch')){
    if(text.toLowerCase()=='#ytsearch'){
      await sock.sendMessage(key.remoteJid,
      {text: 'Please try ==> #ytsearch <<keyword>>'},{quoted: msg});
      return;
      }
    prefix = '#ytsearch';
    const value = text.slice(prefix.length);
    var opts = {
      maxResults: 10,
      key: 'AIzaSyAPlX0aXX1b3Ip3D_r0nTfn7xnvV5Zy4JY'
    };
    search(value, opts,async function(err, results) {
      if(err) return console.log(err);
    
      console.dir(results);
      try{
        for(var i=0; i<3; i++){
        await sock.sendMessage(
          key.remoteJid, 
              {
               text: '----------------------------------------------------------\n' + 
               'Title:' + results[i].title + 
               '\nChannel Title: ' + results[i].channelTitle + 
               '\nLink: ' + results[i].link + 
               '\nDescription: ' + results[i].description + 
               '\n----------------------------------------------------------------'
              },
              {quoted:msg}
          );
        }
      }catch(err){

      }

    });
  }
  else if(text.toLowerCase()=='#ping'){
    var hosts = ['google.com', 'yahoo.com'];

for(let host of hosts){
    let res = await ping.promise.probe(host);
    console.log(res);
    await sock.sendMessage(key.remoteJid,{text: 'Alive: '+ res.alive + '\nPacketLoss: '+ res.packetLoss }, {quoted: msg});
}
  }
  else if(text.toLowerCase() == '#vcf'){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    else{

      const group = await sock.groupMetadata(key.remoteJid);
      const members = group.participants;
  
      const dataArray = members.map((number, index) => [group.subject + ' ' + index , '+'+number.id.slice(0,12)]);

            // Step 1: Write data to XLSX file
      const ws = XLSX.utils.aoa_to_sheet(dataArray);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
      XLSX.writeFile(wb, './vcf/' + group.subject+'.xlsx');

      console.log('Data written to output.xlsx');

      // Step 2: Convert to vCard format
      const vCards = dataArray.map(entry => {
        const card = new vCard();
        card.add('fn', entry[0]);
        card.add('tel', entry[1]);
        return card.toString();
      });

      // Step 3: Save the vCards to a VCF file
      fs.writeFileSync('./vcf/'+ group.subject+'.vcf', vCards.join('\n'));

      console.log('Conversion completed successfully. Output saved to output.vcf');
      sendMessage(key.remoteJid,{document:{url:"./vcf/"+group.subject+".vcf"},mimetype:vCard.mimeType,fileName:group.subject+".vcf"},{quoted: msg});
    }
  }
  else if(!text.toLowerCase().includes('#all')) return;

  else if(text.toLowerCase().startsWith('#all')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }
    const test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
  // 1. get all group members
    const group = await sock.groupMetadata(key.remoteJid);
    const members = group.participants;
    //const profile = await sock.

    const mentions = [];
    const items = [];
    const list = [];
    const number = [];

    members.forEach(({id,admin})=>{
      mentions.push(id);
      items.push(`@${id.slice(0, 12)}${admin ? ' 👑 GOAT': ''}`);

      //console.log('id',hidePrivateData(id));
    });


    const contacts = members.map((number, index) => [group.subject + ' ' + index , '+'+number.id.slice(0,12)]);


  //2.tag them and reply
  sendMessage(key.remoteJid,{text: text.slice(5) + '\n\n' + items.join("\n"),
  mentions }, {quoted: msg});

  const csvContent = "Name, Phone Number\n" + contacts.map(c => c.join(",")).join("\n");

  console.log(`Profile: ${contacts}`)
  }
}catch(err){
  console.log(err);
}

}

sock.ev.on("connection.update",async (update)=>{
  try{
  const {connection,lastDisconnect,qr}=update || {};

  if(qr){
    console.log(qr);
    //write custom logic over here
  }

  if(connection==='close'){
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

    if(shouldReconnect){
      connectionLogic();
    }
  }
}catch(error){
  console.log(error);
}
});

/*sock.ev.on("messages.update", async(messageInfo)=>{
 // console.log(messageInfo);
});*/

sock.ev.on("messages.upsert",async(messageInfoUpsert)=>{
  try{
  messageInfoUpsert.messages.forEach((msg)=>{
    //if(!message.message) return;
    //console.log(message.message.conversation) || console.log(message.message.extendedTextMessage.text);
    //if(message.message.imageMessage!=null){
    // console.log(msg);
    //}
   
    //handleMirror(message);
    handleAll(msg);
  });
    


 // const id = '237671624397@s.whatsapp.net' // the WhatsApp ID 
  //const test = '237659130549-1619032991@g.us' //the Group ID
  //const gg = '120363198766572654@g.us' //group 2

//handleMirror(messageInfoUpsert);
}catch(err){
  console.log(err);
}
});


sock.ev.on ('creds.update', saveCreds);
  }catch(err){
    console.log(err);
  }
}


connectionLogic();

