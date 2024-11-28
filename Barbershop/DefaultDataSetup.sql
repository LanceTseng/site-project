insert into Users (Username, Password, Email, Phone) values("admin", "admin", "admin@admin.com", "12312312345");

insert into Roles (RoleName) values("ADMIN");
insert into Roles (RoleName) values("CUSTOMER");
insert into Roles (RoleName) values("EMPLOYEE");

insert into UserRoles(UserId, RoleId) values ((select u.UserId from Users u where u.Username = "admin"),(select r.RoleId from Roles r where r.RoleName= "ADMIN") );

insert into [dbo].[Services] (ServiceName, Price) values ("Haircut", 20);