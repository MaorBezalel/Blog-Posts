import { PrismaClient } from '@prisma/client';

// import JSON data
import usersJson from './data/users.json';
import postsJson from './data/posts.json';
import commentsJson from './data/comments.json';

// import utils functions
import { clearDatabase, seedTags, seedUsers, seedPosts, seedComments, seedTagsOnPosts, logger } from './utils';

const prisma = new PrismaClient();

async function main() {
    // Clear database
    logger(clearDatabase.name, 'Clearing database...');
    await clearDatabase(prisma);
    logger(clearDatabase.name, 'Database cleared!');

    // Seed Tags
    logger(seedTags.name, 'Seeding tags...');
    const dbTags = await seedTags(prisma, postsJson);
    logger(seedTags.name, 'Tags seeded!');

    // Seed Users
    logger(seedUsers.name, 'Seeding users...');
    const usersNumericIdToCuid = await seedUsers(prisma, usersJson);
    logger(seedUsers.name, 'Users seeded!');

    // Seed Posts
    logger(seedPosts.name, 'Seeding posts...');
    const postsNumericIdToCuid = await seedPosts(prisma, postsJson, usersNumericIdToCuid);
    logger(seedPosts.name, 'Posts seeded!');

    // Seed Comments
    logger(seedComments.name, 'Seeding comments...');
    await seedComments(prisma, commentsJson, usersNumericIdToCuid, postsNumericIdToCuid);
    logger(seedComments.name, 'Comments seeded!');

    // Seed Tags on Posts
    logger(seedTagsOnPosts.name, 'Seeding tags on posts...');
    await seedTagsOnPosts(prisma, postsJson, postsNumericIdToCuid, dbTags);
    logger(seedTagsOnPosts.name, 'Tags on posts seeded!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async e => {
        console.error(`Error seeding: ${e}`);
        await prisma.$disconnect();
        process.exit(1);
    });
