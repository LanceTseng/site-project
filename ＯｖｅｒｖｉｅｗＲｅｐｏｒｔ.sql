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
