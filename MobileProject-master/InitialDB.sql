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

CREATE VIEW OverviewReport AS
SELECT 
    u.Id AS UserId,
    u.UserName,
    u.Role,
    u.Phone,
    u.Email,
    o.Id AS OrderId,
    o.TransactionCode,
    o.Subtotal,
    o.Date AS OrderDate,
    o.Status AS OrderStatus,
    p.Id AS ProductId,
    p.Name AS ProductName,
    p.Price AS ProductPrice,
    cr.Qty AS Quantity,
    cr.Total AS TotalPrice,
    p.Image AS ProductImage
FROM orders o
JOIN users u ON o.UserId = u.Id
LEFT JOIN cart_record cr ON o.TransactionCode = cr.TransactionCode
LEFT JOIN products p ON cr.ProductId = p.Id;