// // seed.ts

// import { connect } from '../lib/db'; // Import database connection
// import { CardModel } from '../models/card'; // Import card model
// import { characters } from './characters'; // Import characters data

// async function seedCards() {
//   try {
//     await connect(); // Connect to the database

//     // Delete all existing cards
//     await CardModel.deleteMany({});

//     // Usernames and corresponding userIds
//     const users = [
//       { username: 'AsukaScrub', userId: '65ba7e62ddd23d0f66492769' },
//       { username: 'Hzayas', userId: '65a9811b324bc916f9b0e747' }
//     ];
//     let userIndex = 0;

//     // Iterate over each character
//     for (const characterName of characters) {
//       // Create cards for the character
//       for (let i = 0; i < 5; i++) { // Create 5 cards for each character (you can adjust this number)
//         const punisherData = generateMoves(3, 'punisher');
//         const moveFlowChartData = generateMoves(3, 'moveFlowChart');

//         const { username, userId } = users[userIndex];

//         const cardData = {
//           characterName,
//           cardName: `Card ${i + 1} for ${characterName}`,
//           cardDescription: `Description for Card ${i + 1} of ${characterName}`,
//           userId,
//           username,
//           punisherData,
//           moveFlowChartData,
//           ratings: [],
//         };

//         // Create the card in the database
//         await CardModel.create(cardData);

//         // Toggle between users
//         userIndex = (userIndex + 1) % users.length;
//       }
//     }

//     console.log('Database seeded successfully!');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// }

// function generateMoves(count: number, type: 'punisher' | 'moveFlowChart') {
//   const moves = [];
//   for (let i = 1; i <= count; i++) {
//     const moveData = {
//       move: i.toString(),
//       description: `Description for Move ${i} (${type})`,
//       hitLevel: '',
//       damage: '',
//       startUpFrame: '',
//       blockFrame: '',
//       hitFrame: '',
//       counterHitFrame: '',
//       notes: '',
//     };
//     moves.push(moveData);
//   }
//   return moves;
// }


// seedCards(); // Call the function to seed the database
