const COINCAP_API = 'https://rest.coincap.io/v3/assets?apiKey=f867aea842e8a1d2ac53bdc01cb120be8841e7f2057d960c8961a5412b08a5c7';
const cryptoList = document.getElementById('cryptoList');
const modal = document.getElementById('coinModal');

let cryptoData = [];
const cryptoIcons = {
  bitcoin: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  ethereum: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  binance: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  ripple: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
  solana: 'https://cryptologos.cc/logos/solana-sol-logo.png',
};

function formatPrice(price) {
  const numPrice = parseFloat(price);
  if (numPrice < 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(numPrice);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numPrice);
}

function formatMarketCap(marketCap) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(marketCap);
}

function getIconUrl(id) {
  return cryptoIcons[id.toLowerCase()] || 'https://cryptologos.cc/logos/question-mark.png';
}

function createCryptoItem(crypto) {
  const priceChangeClass = parseFloat(crypto.changePercent24Hr) >= 0 ? 'positive' : 'negative';
  const item = document.createElement('div');
  item.className = 'crypto-item';
  item.innerHTML = `
    <div class="crypto-icon">
      <img src="${getIconUrl(crypto.id)}" alt="${crypto.name}">
    </div>
    <div class="crypto-info">
      <div class="crypto-name">${crypto.name}</div>
      <div class="crypto-symbol">${crypto.symbol}</div>
    </div>
    <div class="crypto-price">${formatPrice(crypto.priceUsd)}</div>
    <div class="price-change ${priceChangeClass}">
      ${parseFloat(crypto.changePercent24Hr) >= 0 ? '+' : ''}${parseFloat(crypto.changePercent24Hr).toFixed(2)}%
    </div>
  `;
  
  item.addEventListener('click', () => showCoinDetails(crypto));
  return item;
}

function showCoinDetails(coin) {
  const modalTitle = modal.querySelector('.modal-title');
  const coinDetails = modal.querySelector('.coin-details');
  const modalIcon = document.getElementById('modalCoinIcon');
  
  modalIcon.src = getIconUrl(coin.id);
  modalTitle.textContent = `${coin.name} (${coin.symbol})`;
  
  const priceChangeClass = parseFloat(coin.changePercent24Hr) >= 0 ? 'positive' : 'negative';
  
  coinDetails.innerHTML = `
    <div class="crypto-price">${formatPrice(coin.priceUsd)}</div>
    <div class="price-change ${priceChangeClass}">
      ${parseFloat(coin.changePercent24Hr) >= 0 ? '+' : ''}${parseFloat(coin.changePercent24Hr).toFixed(2)}%
    </div>
    
    <div class="price-stats">
      <div class="stat-card">
        <div class="stat-label">Market Cap</div>
        <div class="stat-value">${formatMarketCap(coin.marketCapUsd)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">24h Volume</div>
        <div class="stat-value">${formatMarketCap(coin.volumeUsd24Hr)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Rank</div>
        <div class="stat-value">#${coin.rank}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Supply</div>
        <div class="stat-value">${new Intl.NumberFormat('en-US').format(parseInt(coin.supply))} ${coin.symbol}</div>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

async function fetchCryptoData() {
  try {
    const response = await fetch(COINCAP_API);
    const data = await response.json();
    cryptoData = data.data;
    updateCryptoList(cryptoData);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    cryptoList.innerHTML = '<p>Error loading cryptocurrency data. Please try again later.</p>';
  }
}

function updateCryptoList(data) {
  cryptoList.innerHTML = '';
  data.slice(0, 10).forEach(crypto => {
    cryptoList.appendChild(createCryptoItem(crypto));
  });
}

fetchCryptoData();
setInterval(fetchCryptoData, 1000000);    
