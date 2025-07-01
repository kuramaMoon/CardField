export interface CardInfo {
  image: string;
  code: string;
  suit: string;
  value: string;
}

// Current deck ID, number of decks, and card cache
let deckId = '';
const amountOfDeck = 1;
let cache: CardInfo[] = [];

/**
 * Initializes a new shuffled deck and sets the deck ID.
 */
export async function initDeck(): Promise<void> {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${amountOfDeck}`);
  const data = await response.json();
  deckId = data.deck_id;
}

/**
 * Returns the total number of cards in all decks combined.
 */
export function getAmountInDeck(): number {
  return amountOfDeck * 52;
}

/**
 * Draws a card from cache or fetches a batch from the API if cache is empty.
 * Loads 4 cards per API request, caches them, then returns the first card.
 * @returns A single CardInfo or null if no cards remain.
 */
export async function drawCard(): Promise<CardInfo | null> {
  // Return cached card if available
  if (cache.length > 0) {
    return cache.shift()!;
  }

  // Initialize deck if not yet done
  if (!deckId) {
    await initDeck();
  }

  // Fetch 4 cards from API
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
  const data = await response.json();

  console.log('API drawCard response:', data);

  if (data.success && data.cards && data.cards.length > 0) {
    // Cache cards and return the first one
    cache = data.cards.map((c: any) => ({
      image: c.image,
      code: c.code,
      suit: c.suit,
      value: c.value,
    }));

    return cache.shift()!;
  }

  // No cards left
  return null;
}
