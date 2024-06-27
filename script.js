const generateBtn = document.getElementById('generate-btn');
const envoyerBtn = document.getElementById('envoyer');
const qrInput = document.getElementById('qr-input');
const qrCode = new QRCode(document.getElementById('qr-code'), {
  width: 300,
  height: 250,
});

generateBtn.addEventListener('click', () => {
  const qrText = qrInput.value.trim();
  if (qrText !== '') {
    qrCode.makeCode(qrText);
  }
});