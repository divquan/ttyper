// Text generators for different categories

import type { TextCategory } from '../types/game.js'

// Quotes database
const quotes = [
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Life is what happens when you're busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "The only impossible journey is the one you never begin.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It is better to fail in originality than to succeed in imitation.",
  "Success usually comes to those who are too busy to be looking for it.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Your time is limited, so don't waste it living someone else's life.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Everything you've ever wanted is on the other side of fear.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Believe you can and you're halfway there.",
  "The only person you are destined to become is the person you decide to be.",
  "Everything has beauty, but not everyone can see.",
  "Happiness is not something ready made. It comes from your own actions."
]

// Code snippets database
const codeSnippets = [
  `function calculateSum(numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`,
  `const greeting = (name) => {
  return "Hello, " + name + "! Welcome to the application.";
};`,
  `class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  greet() {
    return "Hi, I'm " + this.name;
  }
}`,
  `async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}`,
  `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`,
  `if (condition) {
  console.log('Condition is true');
} else {
  console.log('Condition is false');
}`,
  `const fibonacci = n => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};`
]

// Common English words
const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
]

export function generateQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)] ?? quotes[0]!
}

export function generateCode(): string {
  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)] ?? codeSnippets[0]!
}

export function generateRandomWords(count: number = 30): string {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]!)
  }
  return words.join(' ')
}

export const textCategories: TextCategory[] = [
  {
    id: 'quotes',
    name: 'Quotes',
    icon: '💬',
    description: 'Famous quotes from history',
    difficulty: 'medium',
    generator: generateQuote
  },
  {
    id: 'code',
    name: 'Code',
    icon: '💻',
    description: 'Programming snippets',
    difficulty: 'hard',
    generator: generateCode
  },
  {
    id: 'random',
    name: 'Random Words',
    icon: '📝',
    description: 'Common English words',
    difficulty: 'easy',
    generator: () => generateRandomWords(40)
  }
]

export function generateText(categoryId: string): string {
  const category = textCategories.find(c => c.id === categoryId)
  if (!category) {
    return generateRandomWords(30)
  }
  return category.generator()
}
