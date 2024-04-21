## Shopping Cart System

This project implements a shopping cart system using Node.js, MySQL, Express, and Prisma as an ORM (Object-Relational Mapper). It leverages TypeScript for type safety and improved code maintainability.

**Features:**

- User cart management (add, update, delete cart items)
- Product stock management (add products and automatic updates based on cart changes)
- Transactional operations for data consistency
- Type safety and improved maintainability through TypeScript

**Requirements:**

- Node.js (version 20.12.x)
- MySQL database server (version 8.x)

**Getting Started:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SayWut/shopping-cart-system.git
   ```

2. **Install dependencies:**

   ```bash
   cd shopping-cart-system
   npm install
   ```

   This command will install all necessary packages from `package.json` file, including Node.js modules like Express and Prisma, as well as TypeScript and its dependencies.

3. **Set up Prisma:**

   - **Create a `.env` file:** In the root directory of your project, create a file named `.env` (make sure it starts with a dot). This file will store your environment variables, including your database connection details.

     Add this variable to your .env file:

     ```
     DATABASE_URL=mysql://your_username:your_password@localhost:3306/shopping_cart_db
     ```

     Replace the placeholders with your actual database credentials:

     - `your_username`: Your MySQL username
     - `your_password`: Your MySQL password
     - `localhost`: Your MySQL server hostname (might be different if running remotely)
     - `3306`: The default MySQL port (might be different if configured otherwise)
     - `shopping_cart_db`: The name of your MySQL database for this project

   - **Initialize Prisma:** Run the following command in your terminal:

     ```bash
     npx prisma migrate dev --name init
     ```

     **Explanation of `npx prisma migrate dev --name init`:**

     This command performs several actions to set up Prisma for your project:

     - **`prisma migrate dev`:** This instructs Prisma to run migration operations in development mode. Development mode provides features like automatic schema updates based on code changes and easier debugging.
     - **`--name init`:** This option specifies the name of the migration to be created. Here, `init` is a common convention for the initial migration that sets up your database schema based on your Prisma models.

     By running this command, you'll establish the connection between your Prisma schema and your MySQL database, creating the necessary tables and ensuring your models are properly mapped to the database structure.

4. **Start the development server:**

   **To run the development server, follow these two steps:**

   1. **Build the project:** Since this project uses TypeScript, the build process is essential. Run the following command in your terminal:

      ```bash
      npm run build
      ```

   2. **Start the server:** Once the build process is complete, start the server using:

      ```bash
      npm start
      ```

   This will start the Node.js server, listening on port 3000.
