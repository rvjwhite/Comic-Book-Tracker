const bcrypt = require('bcryptjs');
const db = require('./db');

const sampleComics = [
  {
    title: 'Amazing Spider-Man',
    publisher: 'Marvel',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('1963-03-01'),
    condition: 'Near Mint',
    gradingCompany: 'CGC',
    grade: 9.6,
    purchasePrice: 100,
    currentValue: 350000,
    notes: 'First appearance of Spider-Man. Holy Grail comic.'
  },
  {
    title: 'Action Comics',
    publisher: 'DC',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('1938-06-01'),
    condition: 'Fine',
    gradingCompany: 'CGC',
    grade: 6.0,
    purchasePrice: 500,
    currentValue: 2000000,
    notes: 'First appearance of Superman. Most valuable comic book.'
  },
  {
    title: 'Detective Comics',
    publisher: 'DC',
    issueNumber: '27',
    variant: 'Regular Edition',
    publicationDate: new Date('1939-05-01'),
    condition: 'Very Good',
    gradingCompany: 'CBCS',
    grade: 4.5,
    purchasePrice: 250,
    currentValue: 1500000,
    notes: 'First appearance of Batman.'
  },
  {
    title: 'X-Men',
    publisher: 'Marvel',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('1963-09-01'),
    condition: 'Very Fine',
    gradingCompany: 'CGC',
    grade: 8.0,
    purchasePrice: 150,
    currentValue: 45000,
    notes: 'First appearance of X-Men team.'
  },
  {
    title: 'Fantastic Four',
    publisher: 'Marvel',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('1961-11-01'),
    condition: 'Fine',
    gradingCompany: 'PGX',
    grade: 6.5,
    purchasePrice: 200,
    currentValue: 75000,
    notes: 'First Marvel superhero team. Beginning of Marvel Age.'
  },
  {
    title: 'The Walking Dead',
    publisher: 'Image',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('2003-10-01'),
    condition: 'Near Mint',
    gradingCompany: 'CGC',
    grade: 9.8,
    purchasePrice: 50,
    currentValue: 8000,
    notes: 'First appearance of Rick Grimes. Modern classic.'
  },
  {
    title: 'Incredible Hulk',
    publisher: 'Marvel',
    issueNumber: '181',
    variant: 'Regular Edition',
    publicationDate: new Date('1974-11-01'),
    condition: 'Very Fine',
    gradingCompany: 'CGC',
    grade: 8.5,
    purchasePrice: 80,
    currentValue: 12000,
    notes: 'First full appearance of Wolverine.'
  },
  {
    title: 'Batman: The Dark Knight Returns',
    publisher: 'DC',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('1986-02-01'),
    condition: 'Near Mint',
    gradingCompany: 'None',
    grade: null,
    purchasePrice: 15,
    currentValue: 350,
    notes: 'Frank Miller masterpiece. Raw copy.'
  },
  {
    title: 'Saga',
    publisher: 'Image',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('2012-03-01'),
    condition: 'Mint',
    gradingCompany: 'CGC',
    grade: 9.9,
    purchasePrice: 25,
    currentValue: 1500,
    notes: 'Modern epic by Brian K. Vaughan.'
  },
  {
    title: 'Spawn',
    publisher: 'Image',
    issueNumber: '1',
    variant: 'Regular Edition',
    publicationDate: new Date('1992-05-01'),
    condition: 'Very Fine',
    gradingCompany: 'None',
    grade: null,
    purchasePrice: 10,
    currentValue: 75,
    notes: 'Todd McFarlane creator-owned series.'
  }
];

async function seedDatabase() {
  try {
    console.log('Using NeDB embedded database (no MongoDB required)');

    // Clear existing data
    console.log('Clearing existing data...');
    await db.collections.remove({}, { multi: true });
    await db.users.remove({}, { multi: true });

    // Create demo user
    console.log('Creating demo user...');
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('demo123', salt);
    const demoUser = await db.users.insert({
      username: 'demo',
      email: 'demo@example.com',
      password: hashed,
      walletAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Demo user created: ${demoUser.email}`);

    // Create sample comics for demo user
    console.log('Creating sample comics...');
    const comics = sampleComics.map(comic => ({
      ...comic,
      userId: demoUser._id,
      isMintedAsNFT: false,
      nftTokenId: null,
      nftContractAddress: null,
      imageUrl: null,
      lastAppraised: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const createdComics = [];
    for (const comic of comics) {
      const created = await db.collections.insert(comic);
      createdComics.push(created);
    }
    console.log(`Created ${createdComics.length} sample comics`);

    // Display summary
    console.log('\n=== Seed Data Summary ===');
    console.log('Demo User Credentials:');
    console.log('  Email: demo@example.com');
    console.log('  Password: demo123');
    console.log(`\nSample Comics: ${createdComics.length}`);
    console.log(`Total Collection Value: $${createdComics.reduce((sum, c) => sum + c.currentValue, 0).toLocaleString()}`);
    console.log('\n=== Seeding Complete ===\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
