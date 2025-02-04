CREATE TABLE users (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing primary key
    UserName NVARCHAR(255) UNIQUE NOT NULL, -- Unique username
    Password NVARCHAR(255) NOT NULL, -- Password
    Phone NVARCHAR(20), -- Phone number
    Email NVARCHAR(255), -- Email address
    CreatedDate DATETIME NOT NULL, -- Date of creation
    Role NVARCHAR(50) -- User role
);

CREATE TABLE products (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing primary key
    Name NVARCHAR(500) NOT NULL, -- Product name
    Description NVARCHAR(MAX), -- Product description
    Price DECIMAL(18, 2) NOT NULL, -- Product price
    Date DATETIME NOT NULL, -- Date of creation
    Image NVARCHAR(MAX) -- Image URL or path
);

CREATE TABLE orders (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing primary key
    TransactionCode NVARCHAR(255) NOT NULL, -- Transaction code
    Subtotal DECIMAL(18, 2) NOT NULL, -- Order subtotal
    Date DATETIME NOT NULL, -- Order date
    UserId INT NOT NULL, -- Foreign key to users table
    Status NVARCHAR(50) NOT NULL, -- Order status
    CONSTRAINT FK_Order_User FOREIGN KEY (UserId) REFERENCES users(Id) -- Foreign key constraint
);

CREATE TABLE cart_record (
    Id INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing primary key
    Qty DECIMAL(18, 2) NOT NULL, -- Quantity
    Total DECIMAL(18, 2) NOT NULL, -- Total amount
    ProductId INT NOT NULL, -- Foreign key to products table
    UserId INT NOT NULL, -- Foreign key to users table
    Status NVARCHAR(50) NOT NULL, -- Cart record status
    TransactionCode NVARCHAR(255), -- Transaction code
    CONSTRAINT FK_CartRecord_Product FOREIGN KEY (ProductId) REFERENCES products(Id), -- Foreign key constraint
    CONSTRAINT FK_CartRecord_User FOREIGN KEY (UserId) REFERENCES users(Id) -- Foreign key constraint
);