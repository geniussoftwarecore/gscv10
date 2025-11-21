#!/usr/bin/env tsx

import { Pool } from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

async function seedDemoData(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error(chalk.red('❌ DATABASE_URL environment variable is required'));
    console.log(chalk.yellow('Please set DATABASE_URL in your .env file or environment'));
    process.exit(1);
  }

  console.log(chalk.bold.blue('\n📊 Seeding Demo Data\n'));
  console.log(chalk.yellow('⚠️  This will add sample data to your database'));
  console.log(chalk.yellow('⚠️  Admin users will NOT be affected\n'));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let client;
  
  try {
    client = await pool.connect();
    
    // Test database connection
    try {
      await client.query('SELECT 1');
    } catch (dbError: any) {
      console.error(chalk.red('❌ Database connection failed'));
      console.log(chalk.yellow('Please ensure your database is running and DATABASE_URL is correct'));
      process.exit(1);
    }

    console.log(chalk.blue('🔄 Adding demo services...'));
    
    // Demo Services
    const services = [
      {
        id: randomUUID(),
        title: 'Web Development',
        description: 'Custom web applications using modern frameworks',
        icon: 'Globe',
        category: 'development',
        featured: 'true',
        technologies: JSON.stringify(['React', 'Node.js', 'TypeScript', 'PostgreSQL']),
        deliveryTime: '2-4 weeks',
        startingPrice: '$2,500'
      },
      {
        id: randomUUID(),
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications',
        icon: 'Smartphone',
        category: 'development',
        featured: 'true',
        technologies: JSON.stringify(['React Native', 'Flutter', 'Swift', 'Kotlin']),
        deliveryTime: '3-6 weeks',
        startingPrice: '$5,000'
      },
      {
        id: randomUUID(),
        title: 'UI/UX Design',
        description: 'User-centered design for digital products',
        icon: 'Palette',
        category: 'design',
        featured: 'false',
        technologies: JSON.stringify(['Figma', 'Adobe XD', 'Sketch', 'Principle']),
        deliveryTime: '1-2 weeks',
        startingPrice: '$1,200'
      }
    ];

    for (const service of services) {
      await client.query(`
        INSERT INTO services (id, title, description, icon, category, featured, technologies, delivery_time, starting_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING
      `, [service.id, service.title, service.description, service.icon, service.category, service.featured, service.technologies, service.deliveryTime, service.startingPrice]);
    }

    console.log(chalk.blue('🔄 Adding demo testimonials...'));
    
    // Demo Testimonials
    const testimonials = [
      {
        id: randomUUID(),
        name: 'Sarah Johnson',
        position: 'CEO',
        company: 'TechStart Inc.',
        content: 'Exceptional work quality and professional service. The team delivered beyond our expectations.',
        rating: '5'
      },
      {
        id: randomUUID(),
        name: 'Mike Chen',
        position: 'Product Manager',
        company: 'InnovateCorp',
        content: 'Outstanding technical expertise and great communication throughout the project.',
        rating: '5'
      },
      {
        id: randomUUID(),
        name: 'Emily Rodriguez',
        position: 'Founder',
        company: 'GrowthLab',
        content: 'Professional, reliable, and delivered exactly what we needed on time.',
        rating: '5'
      }
    ];

    for (const testimonial of testimonials) {
      await client.query(`
        INSERT INTO testimonials (id, name, position, company, content, rating)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [testimonial.id, testimonial.name, testimonial.position, testimonial.company, testimonial.content, testimonial.rating]);
    }

    console.log(chalk.blue('🔄 Adding demo portfolio items...'));
    
    // Demo Portfolio Items
    const portfolioItems = [
      {
        id: randomUUID(),
        slug: 'ecommerce-platform',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce solution with advanced features',
        fullDescription: 'A comprehensive e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and advanced analytics.',
        category: 'E-commerce',
        industry: 'Retail',
        services: JSON.stringify(['Web Development', 'UI/UX Design', 'Database Design']),
        imageUrl: '/images/portfolio/ecommerce-thumb.jpg',
        coverImage: '/images/portfolio/ecommerce-cover.jpg',
        projectUrl: 'https://github.com/example/ecommerce',
        liveUrl: 'https://demo-ecommerce.example.com',
        technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis']),
        featured: 'true',
        year: '2024',
        duration: '3 months',
        teamSize: '4',
        budget: '$15,000',
        status: 'published'
      },
      {
        id: randomUUID(),
        slug: 'task-management-app',
        title: 'Task Management App',
        description: 'Collaborative project management tool',
        fullDescription: 'A feature-rich task management application with real-time collaboration, file sharing, and advanced reporting capabilities.',
        category: 'Productivity',
        industry: 'Software',
        services: JSON.stringify(['Mobile Development', 'Web Development', 'API Development']),
        imageUrl: '/images/portfolio/taskapp-thumb.jpg',
        coverImage: '/images/portfolio/taskapp-cover.jpg',
        projectUrl: 'https://github.com/example/taskapp',
        liveUrl: 'https://demo-tasks.example.com',
        technologies: JSON.stringify(['React Native', 'Express', 'MongoDB', 'Socket.io']),
        featured: 'true',
        year: '2024',
        duration: '2 months',
        teamSize: '3',
        budget: '$12,000',
        status: 'published'
      }
    ];

    for (const item of portfolioItems) {
      await client.query(`
        INSERT INTO portfolio_items (
          id, slug, title, description, full_description, category, industry, 
          services, image_url, cover_image, project_url, live_url, technologies, 
          featured, year, duration, team_size, budget, status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
      `, [
        item.id, item.slug, item.title, item.description, item.fullDescription,
        item.category, item.industry, item.services, item.imageUrl, item.coverImage,
        item.projectUrl, item.liveUrl, item.technologies, item.featured, item.year,
        item.duration, item.teamSize, item.budget, item.status
      ]);
    }

    console.log(chalk.blue('🔄 Adding demo contact submissions...'));
    
    // Demo Contact Submissions
    const contactSubmissions = [
      {
        id: randomUUID(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        service: 'Web Development',
        message: 'Interested in building a custom web application for our business.'
      },
      {
        id: randomUUID(),
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '+1-555-0456',
        service: 'Mobile App Development',
        message: 'Looking for a mobile app to complement our existing web platform.'
      }
    ];

    for (const submission of contactSubmissions) {
      await client.query(`
        INSERT INTO contact_submissions (id, name, email, phone, service, message, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO NOTHING
      `, [submission.id, submission.name, submission.email, submission.phone, submission.service, submission.message]);
    }

    // Print success message
    console.log(chalk.bold.green('\n🎉 DEMO DATA SEEDED SUCCESSFULLY!\n'));
    console.log(chalk.blue('Added:'));
    console.log(chalk.white(`  • ${services.length} demo services`));
    console.log(chalk.white(`  • ${testimonials.length} demo testimonials`));
    console.log(chalk.white(`  • ${portfolioItems.length} demo portfolio items`));
    console.log(chalk.white(`  • ${contactSubmissions.length} demo contact submissions`));
    
    console.log(chalk.bold.yellow('\n📝 NOTE:\n'));
    console.log(chalk.yellow('• Demo data is safe to use in development'));
    console.log(chalk.yellow('• Admin users were NOT affected by this seeding'));
    console.log(chalk.yellow('• You can run this script multiple times safely'));
    console.log(chalk.yellow('• To clear demo data, use your database management tools'));
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Failed to seed demo data: ${error.message}`));
    if (error.code === 'ECONNREFUSED') {
      console.log(chalk.yellow('Database connection refused. Please ensure PostgreSQL is running.'));
    }
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

// Handle CLI execution (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  seedDemoData().catch((error) => {
    console.error(chalk.red(`Demo seeding failed: ${error.message}`));
    process.exit(1);
  });
}

export { seedDemoData };