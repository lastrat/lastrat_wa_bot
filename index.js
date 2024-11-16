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

// ********************************************************************
// -------- Function Check if message comes from a  Group -------------
// ********************************************************************

const isGroup = (key)=>{
  if(key.remoteJid.includes('@g.us')){
    return true;
  }
  else{
    return false;
  }
}

// ********************************************************************
// -------Function Check if message is coming from APP Admin ---------
// ********************************************************************

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


// ********************************************************************
// -------Function Check if message is coming from Group Admin ------
// ********************************************************************

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

// ********************************************************************
// -------Convert String array to number array -------------
// ********************************************************************
function stringToNumberArray(inputString,suffix) {
  // Split the input string by comma to obtain an array of strings
  var numbersStringArray = inputString.split(',');
      return numbersStringArray.map(function(element) {
        return element + suffix;
      });

}


// ********************************************************************
// ---------------------- Functionalities Start ----------------------
// ********************************************************************


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
  
// ********************************************************************
// ----------------------- Bot Menu -----------------------------------
// ********************************************************************
  else if (text.toLowerCase() == "#menu") {
    sendMessage(key.remoteJid, { text: 
      '╔═════════════════════════════════════════════════╗\n' +
      '    🌸 𝑂𝒽𝒶𝓎𝑜𝑜, ' + pushName + ' -𝓈𝑒𝓃𝓅𝒶𝒾 🌸\n' +
      '       ( ͡❛ ͜ʖ ͡❛) 𝒲𝑒𝓁𝒸𝑜𝓂𝑒!\n' +
      '╚═════════════════════════════════════════════════╝\n\n' +
      '✨ I am *Lastrat Satoru*, your AI companion ✨\n' +
      '✦ My prefix is # ✦\n\n' +

      '━━━━━ ❰ ✤ GENERAL ✤ ❱ ━━━━━\n' +
      '🔹 #ping  ➔  Check my response time\n\n' +

      '━━━━━ ❰ ✤ GROUP ✤ ❱ ━━━━━\n' +
      '🔹 #add <<phone number>>\n' +
      '🔹 #kick <<phone number>>\n' +
      '🔹 #promote <<phone number>>\n' +
      '🔹 #demote <<phone number>>\n' +
      '🔹 #setdesc <<group description>>\n' +
      '🔹 #setppgc <<send an image>>\n' +
      '🔹 #setsub <<group name>>\n' +
      '🔹 #gpmsg <<on/off>>\n' +
      '🔹 #gpsetting <<on/off>>\n' +
      '🔹 #outgp ➔ Leave the group\n' +
      '🔹 #gplink ➔ Get group link\n' +
      '🔹 #gprevoke ➔ Revoke group link\n' +
      '🔹 #join <<group link>>\n' +
      '🔹 #gpinfo <<group link>>\n' +
      '🔹 #all ➔ Tag everyone\n\n' +

      '━━━━━ ❰ ✤ OTHER ✤ ❱ ━━━━━\n' +
      '🔹 #meme ➔ Get a meme\n' +
      '🔹 #sticker <<send an image>>\n' +
      '🔹 #animewall <<anime name>>\n' +
      '🔹 #ask <<your question>>\n' +
      '🔹 #vcf ➔ Get a virtual contact file\n\n' +

      '━━━━━ ❰ ✤ DOWNLOAD ✤ ❱ ━━━━━\n' +
      '🔹 #ytmp3 <<YouTube video link>>\n' +
      '🔹 #ytmp4 <<YouTube video link>>\n' +
      '🔹 #fb <<Facebook video link>>\n' +
      '🔹 #tk <<TikTok video link>>\n' +
      '🔹 #ytsearch <<keywords>> ➔ Search YouTube\n\n' +

      '╚════════════════════════════╝\n' +
      '   ✨ Enjoy the experience! ✨'},
      { quoted: msg });
  }


// ********************************************************************
// --------------------Remove a member of a group ---------------------
// ********************************************************************
  else if(text.toLowerCase().startsWith('#kick')){
    if(!isGroup(key)){
      sendMessage(key.remoteJid,{text: '*Function only work inside group*' }, {quoted: msg});
      return "";
    }

    //check if group admin
    var test = await isAdmin(key);
    if(test==0){
      sendMessage(key.remoteJid,{text: '*Only Group Admin can use this functionality Bakaa*' }, {quoted: msg});
      return "";
    }
    //check conformity
    if(text.toLowerCase()=='#kick'){await sock.sendMessage(key.remoteJid,
      {text: 'Please try like this ==> #kick 237671624397'},{quoted: msg});
    return;
    }

    const prefix = "#kick";
    const value = text.slice(prefix.length);
    var test2 = adminCheck(value.trim());
    //check if wanna remove bot creator
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

  // ********************************************************************
  // -------Promote a member of a group to Admin ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // ------------- Demote a member of a group from Admin ---------------S- 
  // ********************************************************************
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

  // ********************************************************************
  // ------------------ Change Group description ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // ---------------------- Change Group Name ---------------------------
  // ********************************************************************
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

  // ********************************************************************
  // -------Promote a member of a group to Admin ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // -----Change group setting allow change Desc|Profile|Groupe Name ----
  // ********************************************************************
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
  // ********************************************************************
  // ------------------------ get Group Link ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // -------Revoke Whatsapp Group Link ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // ------- Add Whatsapp Bot to a Whatsapp Group -----------------------
  // ********************************************************************
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
  // ********************************************************************
  // ---------- GET WHATSAPP GROUP INFORMATIONS ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // -------------- SET IMAGE PROFILE OF A GROUP ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // --------------- GET RANDOM ANIME WALL PAPER ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // -------------- GET SPECIFIC ANIME WALL PAPER------------------------
  // ********************************************************************
  else if(text.toLowerCase().startsWith('#animewall')){
    var prefix = "#animewall";
    const value = text.slice(prefix.length);
    var i=0;
    try{
      const anime = await wallpaper.search({ title: value }, AnimeSource.WallHaven);
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

  // ********************************************************************
  // -------------------- ASK QUESTIONS TO AN AI ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // --------------------- DOWNLOAD TIKTOK VIDEO ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // ------------------ CONVERT IMAGE TO STICKER ------------------------
  // ********************************************************************
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
    if (!buffer) {
      throw new Error("Failed to download media message. Buffer is empty.");
  }

  // await writeFile('./media/sticker.webp', buffer);
  const stickerFile = fs.readFileSync("media/sticker.webp"); // media is an Express.Multer.File
  const stickerBuffer = Buffer.from(stickerFile);

  const sticker = new Sticker(stickerBuffer, {
      pack: 'Ryouki tenkai', // The pack name
      author: 'Lastrat Satoru', // The author name
      type: StickerTypes.CROPPED, // The sticker type
  });
  const buffer2 = await sticker.toBuffer();

  console.log("Sticker generated successfully!");

    await sock.sendMessage(
      key.remoteJid, 
      {
        sticker:buffer2,
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

  // ********************************************************************
  // ---------------------- GENERATE RANDOM MEME ------------------------
  // ********************************************************************
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

  // ********************************************************************
  // -------------------------- YOUTUBE RESEARCH ------------------------
  // ********************************************************************
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
                  text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                        '📜 *Title:* ' + results[i].title + '\n' +
                        '📺 *Channel:* ' + results[i].channelTitle + '\n' +
                        '🔗 *Link:* ' + results[i].link + '\n\n' +
                        '📝 *Description:*\n' + results[i].description + '\n' +
                        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
              }, 
              {quoted:msg}
          );
        }
      }catch(err){

      }

    });
  }

  // ********************************************************************
  // -------TEST SPEED OF BOT------------------------
  // ********************************************************************
  else if(text.toLowerCase()=='#ping'){
    var hosts = ['google.com', 'yahoo.com'];

for(let host of hosts){
    let res = await ping.promise.probe(host);
    console.log(res);
    await sock.sendMessage(key.remoteJid,{text: 'Alive: '+ res.alive + '\nPacketLoss: '+ res.packetLoss }, {quoted: msg});
}
  }

  // ********************************************************************
  // ------- EXPORT VCF CONTACT FILE OF A GROUP ¨------------------------
  // ********************************************************************
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
      XLSX.writeFile(wb, './vcf/' + 'test'+'.xlsx');

      console.log('Data written to output.xlsx');

      // Step 2: Convert to vCard format
      const vCards = dataArray.map(entry => {
        const card = new vCard();
        card.add('fn', entry[0]);
        card.add('tel', entry[1]);
        return card.toString();
      });

      // Step 3: Save the vCards to a VCF file
      fs.writeFileSync('./vcf/'+ 'test'+'.vcf', vCards.join('\n'));

      console.log('Conversion completed successfully. Output saved to output.vcf');
      sendMessage(key.remoteJid,{document:{url:"./vcf/"+'test'+".vcf"},mimetype:vCard.mimeType,fileName:'test'+".vcf"},{quoted: msg});
    }
  }
  else if(!text.toLowerCase().includes('#all')) return;

  // ********************************************************************
  // ------- TAG ALL MEMBERS OF A WHATSAPP GROUP ------------------------
  // ********************************************************************
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


//Update Whatsapp connection
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


// When ever a message is send via whatsapp or you send a message
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

