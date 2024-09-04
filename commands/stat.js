const db = require('../config/config').db;
const pointRef = db.ref('dataPengguna/pengguna');
const {getLevel} = require('../lib/getLevelStat');

module.exports = async (message) => {
  try {
    const sA = message.author;
    const sender = message.from;
    const corection = sA !== undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const RefNama = pointRef.child(sanitizedSender).child('nama');
    const RefPoint = pointRef.child(sanitizedSender).child('point');
    const RefExp = pointRef.child(sanitizedSender).child('exp');
    const RefRep = pointRef.child(sanitizedSender).child('reputasi');

    const getTier = (reputasi) => {
      if(reputasi <= 0) return "💀BOCAH TOXIC💀";
      if(reputasi <= 10) return "--_Bronze_--";
      if(reputasi <= 20) return "--_Silver_--";
      if(reputasi <= 30) return "--_Gold_--";
      if(reputasi <= 50) return "--_Platinum_--";
      if(reputasi <= 100) return "--💎_Diamond_💎--";
      if(reputasi <= 200) return "--♚_CROWN_♚--";
      if(reputasi <= 500) return "--⭐_ACE_⭐--";
      if(reputasi === 666) return "S0N-0F-S4TAN";
      if(reputasi <= 1000) return "--🔥_CONQUEROR_🔥--";
      if(reputasi >= 2000) return "--👑GOD👑--";
      return "Anak💀Haram";
    };

    const [reputasiSnapshot, pointSnapshot, namaSnapshot, expSnapshot] = await Promise.all([
      RefRep.once('value'),
      RefPoint.once('value'),
      RefNama.once('value'),
      RefExp.once('value')
    ]);

    const reputasi = reputasiSnapshot.val() || 0;
    const tier = getTier(reputasi);

    const poin = pointSnapshot.val() || 0;
    const point = poin.toLocaleString('id-ID', { minimumFractionDigits: 0 });

    const nama = namaSnapshot.val() || 'Nama Mu Masih kosong';

    const exp = expSnapshot.val() || 0;
    const { level, rank } = getLevel(exp);

    return `${nama}\n
    - Level: *${level}* (${rank})
    - Keramahan: *${tier}*
    - Point Kamu: *${point}*
    - Reputasi: *${reputasi}*
    - EXP: *${exp}*`;

  } catch (error) {
    console.error('Error while fetching data:', error);
    return 'Error while fetching !stat';
  }
};
