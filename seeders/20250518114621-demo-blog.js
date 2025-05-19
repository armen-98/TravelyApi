'use strict';

const { faker } = require('@faker-js/faker');

function generateBlogTitle(category) {
  const titles = {
    Travel: [
      'Top 10 Hidden Gems in Southeast Asia',
      'A Backpacker’s Guide to Europe',
      'Exploring the Wonders of South America',
      'The Ultimate Road Trip in Australia',
      'Cultural Experiences You Can’t Miss in Africa',
    ],
    Food: [
      '10 Street Foods You Must Try',
      'The Art of French Cooking',
      'Vegan Delights from Around the World',
      'Hidden Food Markets You Should Visit',
      'Sushi: A Cultural Journey',
    ],
    Technology: [
      'The Rise of Artificial Intelligence',
      'Best Tech Gadgets of 2025',
      'Exploring the Future of Smart Homes',
      'How Blockchain is Changing the World',
      'The Impact of 5G Technology',
    ],
    Lifestyle: [
      'Minimalism: Living With Less',
      'The Power of Mindfulness',
      'Interior Design Trends to Watch',
      'Daily Habits of Successful People',
      'Creating a Balanced Work-Life Routine',
    ],
    Education: [
      'Top Online Learning Platforms Reviewed',
      'How to Stay Motivated When Studying Online',
      'Educational Trends in 2025',
      'Balancing Work and Education Effectively',
      'The Importance of Lifelong Learning',
    ],
  };
  const categoryTitles = titles[category] || titles['Lifestyle'];
  return faker.helpers.arrayElement(categoryTitles);
}

function generateBlogContent(category) {
  return `${faker.lorem.paragraphs(3)}\n\nCategory Insight: ${category} - ${faker.lorem.sentence()}`;
}

function generateComment() {
  return faker.lorem.sentences(2);
}

function generateReply() {
  return faker.lorem.sentence();
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // ✅ Get real categories and users
      let categories = await queryInterface.sequelize.query(
        `SELECT "id", "title", "type" FROM "Categories" WHERE "type" = 'blog';`,
        { type: Sequelize.QueryTypes.SELECT },
      );
      const users = await queryInterface.sequelize.query(
        'SELECT "id" FROM "Users";',
        { type: Sequelize.QueryTypes.SELECT },
      );

      const blogs = [];
      const tags = [];
      const images = [];
      const comments = [];
      if (categories.length === 0) {
        const blogCategoryData = [
          {
            title: 'Travel',
            type: 'blog',
          },
          {
            title: 'Food & Dining',
            type: 'blog',
          },
          {
            title: 'Lifestyle',
            type: 'blog',
          },
          {
            title: 'Technology',
            type: 'blog',
          },
          {
            title: 'Health & Wellness',
            type: 'blog',
          },
        ];

        // Create blog categories if they don't exist
        const now = new Date();
        const categoryRecords = blogCategoryData.map((category) => ({
          title: category.title,
          type: 'blog',
          icon: `fa-${category.slug}`,
          color: faker.internet.color(),
          createdAt: now,
          updatedAt: now,
        }));

        await queryInterface.bulkInsert('Categories', categoryRecords);

        // Get the newly created categories
        categories = await queryInterface.sequelize.query(
          `SELECT "id", "title" FROM "Categories" WHERE type = 'blog'`,
          { type: queryInterface.sequelize.QueryTypes.SELECT },
        );
      }

      for (const category of categories) {
        for (let i = 0; i < 5; i++) {
          const title = generateBlogTitle(category.title);
          const content = generateBlogContent(category.title);
          const userId = faker.helpers.arrayElement(users).id;

          const createdAt = new Date();
          const updatedAt = createdAt;

          const blog = {
            title,
            authorId: userId,
            createdAt,
            updatedAt,
          };

          blogs.push(blog);

          // Tags
          for (let j = 0; j < 2; j++) {
            tags.push({
              name: faker.word.words(1),
              createdAt,
              updatedAt,
            });
          }

          // Image
          images.push({
            thumb: `https://dashboard.iammedia.am/assets/uploads/posts/thumbnails/image-1598879528122.jpg`,
            full: `https://dashboard.iammedia.am/assets/uploads/posts/thumbnails/image-1598879528122.jpg`,
            createdAt,
            updatedAt,
          });

          // Comments + Replies
          const numComments = faker.number.int({ min: 2, max: 4 });
          for (let k = 0; k < numComments; k++) {
            const commentUser = faker.helpers.arrayElement(users);
            const comment = {
              content: generateComment(),
              userId: commentUser.id,
              createdAt,
              updatedAt,
            };

            comments.push(comment);

            const numReplies = faker.number.int({ min: 0, max: 2 });
            for (let l = 0; l < numReplies; l++) {
              const replyUser = faker.helpers.arrayElement(users);
              comments.push({
                content: generateReply(),
                userId: replyUser.id,
                blogId: comments.length, // rough reply logic
                createdAt,
                updatedAt,
              });
            }
          }
        }
      }

      await queryInterface.bulkInsert('Blogs', blogs, {});
      await queryInterface.bulkInsert('Images', images, {});
      // await queryInterface.bulkInsert('Comments', comments, {});

      console.log(`✅ Seeded ${blogs.length} blogs`);
      console.log(`✅ Seeded ${tags.length} tags`);
      console.log(`✅ Seeded ${images.length} images`);
      console.log(`✅ Seeded ${comments.length} comments & replies`);
    } catch (e) {
      console.error('❌ Blog seeder error:', e);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('BlogComments', null, {});
    await queryInterface.bulkDelete('BlogImages', null, {});
    await queryInterface.bulkDelete('BlogTags', null, {});
    await queryInterface.bulkDelete('Blogs', null, {});
  },
};
