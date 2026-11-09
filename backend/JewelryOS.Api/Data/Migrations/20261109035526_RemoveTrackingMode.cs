using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewelryOS.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTrackingMode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrackingMode",
                table: "Products");

            // The low-stock alert now covers every product. The old default (1) would flag every
            // single piece that is still in stock, so move it to the new default (0 = sold out only).
            migrationBuilder.Sql("UPDATE \"Settings\" SET \"LowStockThreshold\" = 0 WHERE \"LowStockThreshold\" = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrackingMode",
                table: "Products",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "Quantity");
        }
    }
}
