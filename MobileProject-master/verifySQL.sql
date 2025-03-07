select * from users where UserName = 'ray';

select * from cart_record t where exists(select 1 from users u where u.Id=t.UserId and u.UserName = 'ray') ;

select * from orders o where exists( select 1 from cart_record t where exists(select 1 from users u where u.Id=t.UserId and u.UserName = 'ray') and o.TransactionCode = t.TransactionCode   ) ;

select * from OverviewReport t where t.UserName = 'ray'; 