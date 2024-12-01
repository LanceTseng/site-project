using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionShop.Migrations
{
    /// <inheritdoc />
    public partial class addconstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CardCode",
                table: "Orders",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CartCode",
                table: "Carts",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Orders_CardCode",
                table: "Orders",
                column: "CardCode");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CardCode",
                table: "Orders",
                column: "CardCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Carts_CartCode",
                table: "Carts",
                column: "CartCode");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Orders_CartCode",
                table: "Carts",
                column: "CartCode",
                principalTable: "Orders",
                principalColumn: "CardCode",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Orders_CartCode",
                table: "Carts");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Orders_CardCode",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CardCode",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Carts_CartCode",
                table: "Carts");

            migrationBuilder.AlterColumn<string>(
                name: "CardCode",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "CartCode",
                table: "Carts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
