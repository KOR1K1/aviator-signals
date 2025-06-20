// Генерує випадковий хеш (як get-hash.php)
export function getHash() {
  try {
    // 16 bytes = 32 hex chars
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error in getHash:', error);
    throw error;
  }
}

// Аналог flight-result.php (російське повідомлення)
export function getFlightResult(bet) {
  try {
    bet = parseInt(bet, 10) || 0;
    if (bet <= 0) {
      return { message: 'Некоректна ставка' };
    }
    const gamesLeft = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
    const multiplier = (Math.floor(Math.random() * (900 - 300 + 1)) + 300) / 10;
    const chance = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
    const message = `Вам осталось ${gamesLeft} игр со ставкой ${bet}, до заноса X${multiplier} с шансом ${chance}%`;
    return { message };
  } catch (error) {
    console.error('Error in getFlightResult:', error);
    throw error;
  }
}

// Аналог flight-result2.php (англійське повідомлення)
export function getFlightResult2(bet) {
  try {
    bet = parseInt(bet, 10) || 0;
    if (bet <= 0) {
      return { message: 'Invalid bet' };
    }
    const gamesLeft = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
    const multiplier = (Math.floor(Math.random() * (900 - 300 + 1)) + 300) / 10;
    const chance = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
    const message = `You have ${gamesLeft} games left with bet of ${bet} before hitting X${multiplier} with a ${chance}% chance`;
    return { message };
  } catch (error) {
    console.error('Error in getFlightResult2:', error);
    throw error;
  }
} 
