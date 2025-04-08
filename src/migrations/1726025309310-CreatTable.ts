import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatTable1726025309310 implements MigrationInterface {
  name = 'CreatTable1726025309310';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "um_Role_Permission" ("Role_ID" int NOT NULL, "Menu_No" nvarchar(5) NOT NULL, "Can_Add" nvarchar(1) NOT NULL, "Can_Update" nvarchar(1) NOT NULL, "Can_View" nvarchar(1) NOT NULL, "Created_By" int, "Created_Date" datetime, "Updated_By" int, "Updated_Date" datetime, CONSTRAINT "PK_6fa1309576015e689a732fe4e3c" PRIMARY KEY ("Role_ID", "Menu_No"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "um_Role" ("Role_ID" int NOT NULL IDENTITY(1,1), "Role_Name_TH" nvarchar(200) NOT NULL, "Role_Name_EN" nvarchar(200) NOT NULL, "Is_Active" nvarchar(1) NOT NULL, "Created_By" int, "Created_Date" datetime CONSTRAINT "DF_ebe9117d50768e5174f5799ba10" DEFAULT getdate(), "Updated_By" int, "Updated_Date" datetime CONSTRAINT "DF_3e3b33db8c4d8132114f804fe8d" DEFAULT getdate(), CONSTRAINT "PK_669a023ede661f5c1142ba5a808" PRIMARY KEY ("Role_ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "co_Predefine" ("Predefine_Group" nvarchar(20) NOT NULL, "Predefine_CD" nvarchar(20) NOT NULL, "Description" nvarchar(600), "Value_TH" nvarchar(600) NOT NULL, "Value_EN" nvarchar(600) NOT NULL, "Is_Active" nvarchar(1) NOT NULL, "Created_By" int, "Created_Date" datetime CONSTRAINT "DF_aff4c2aa8b674a36dc3e3424e11" DEFAULT getdate(), "Updated_By" int, "Updated_Date" datetime CONSTRAINT "DF_2109bd1ca4b91266be0e5ff099c" DEFAULT getdate(), CONSTRAINT "PK_f8b4d91453b1a244a7fa6cdd6c9" PRIMARY KEY ("Predefine_Group", "Predefine_CD"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "um_Menu" ("Menu_No" nvarchar(10) NOT NULL, "Menu_Name_TH" nvarchar(255) NOT NULL, "Menu_Name_EN" nvarchar(255) NOT NULL, "URL" nvarchar(255), "Menu_Group" nvarchar(10), "Menu_Icon" nvarchar(255), "Is_MainMenu" nvarchar(1), "Is_Active" nvarchar(1), "Menu_Seq" int, "Created_By" int, "Created_Date" datetime CONSTRAINT "DF_f34099886409e6ba7d2dbc33519" DEFAULT getdate(), "Updated_by" int, "Updated_Date" datetime CONSTRAINT "DF_13b853b50017a2027f49340f918" DEFAULT getdate(), CONSTRAINT "PK_43d3bf898226cd35b6af190c18b" PRIMARY KEY ("Menu_No"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "um_User_Role" ("User_Role_ID" int NOT NULL IDENTITY(1,1), "User_ID" int NOT NULL, "Role_ID" int NOT NULL, "Is_Active" char(1), "Created_By" int, "Created_Date" datetime CONSTRAINT "DF_6cfc5e6dee77cea505e41a3ece9" DEFAULT getdate(), "Updated_by" int, "Updated_Date" datetime CONSTRAINT "DF_d7b17545c08f4724ae2eff7670f" DEFAULT getdate(), CONSTRAINT "PK_f0b1f44809ae02bab31640cb48b" PRIMARY KEY ("User_Role_ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "um_User" ("User_ID" int NOT NULL IDENTITY(1,1), "Username" nvarchar(40) NOT NULL, "User_Password" nvarchar(200), "First_Name" nvarchar(200), "Last_Name" nvarchar(200), "Position_Name" nvarchar(200), "Is_Active" nvarchar(1), "Created_By" int, "Created_Date" datetime CONSTRAINT "DF_ae1de3d7b42bf1a821f9d79a78d" DEFAULT getdate(), "Updated_By" int, "Updated_Date" datetime CONSTRAINT "DF_60e40aa829642909737f5f06ccf" DEFAULT getdate(), CONSTRAINT "UQ_e937103a6ea41471bd273f8efb1" UNIQUE ("Username"), CONSTRAINT "PK_ce2a09e917199f127dfc4edae50" PRIMARY KEY ("User_ID"))`,
    );
    // await queryRunner.query(
    //   `CREATE TABLE "um_Menu_Route" ("Menu_Route_ID" int NOT NULL IDENTITY(1,1), "Menu_No" nvarchar(5) NOT NULL, "Route_Name" nvarchar(200) NOT NULL, "Route_Path" nvarchar(200) NOT NULL, "Physical_Path" nvarchar(500) NOT NULL, "Is_Require_Auth" bit NOT NULL, CONSTRAINT "PK_c8ac399c3f45c21c35c2184eb2d" PRIMARY KEY ("Menu_Route_ID"))`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE "um_Menu_Route"`);
    await queryRunner.query(`DROP TABLE "um_User"`);
    await queryRunner.query(`DROP TABLE "um_User_Role"`);
    await queryRunner.query(`DROP TABLE "um_Menu"`);
    await queryRunner.query(`DROP TABLE "co_Predefine"`);
    await queryRunner.query(`DROP TABLE "um_Role"`);
    await queryRunner.query(`DROP TABLE "um_Role_Permission"`);
  }
}
