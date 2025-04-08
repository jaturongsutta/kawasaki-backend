import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserData1726026230186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SET IDENTITY_INSERT um_User ON;

      INSERT INTO um_User (User_ID, Username, User_Password, First_Name, Last_Name, Position_Name, Is_Active, Created_By, Created_Date, Updated_By, Updated_Date)
      VALUES 
        (1, 'system', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Admin', 'User', 'Administrator', 'Y', 1, GETDATE(), 1, GETDATE()),
        (2, 'user', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Regular', 'User', 'Employee', 'Y', 1, GETDATE(), 1, GETDATE());

      SET IDENTITY_INSERT um_User OFF;


      SET IDENTITY_INSERT um_User_Role ON;
      INSERT INTO um_User_Role (User_Role_ID, User_ID, Role_ID, Is_Active, Created_By, Created_Date, Updated_By, Updated_Date)
      VALUES 
        (1, 1, 1, 'Y', 1, GETDATE(), 1, GETDATE());

      SET IDENTITY_INSERT um_User_Role OFF;

      INSERT INTO um_Role_Permission (Role_ID, Menu_No, Can_Add, Can_Update, Can_View)
      VALUES 
       --(1, 'M1000', 'Y', 'Y', 'Y'),
       (1, 'M1001', 'Y', 'Y', 'Y'),
       (1, 'M1002', 'Y', 'Y', 'Y'),
       (1, 'M1003', 'Y', 'Y', 'Y'),
       (1, 'M1004', 'Y', 'Y', 'Y'),
       (1, 'M1005', 'Y', 'Y', 'Y');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM um_User WHERE User_ID IN (1, 2);

      DELETE FROM um_User_Role WHERE User_ID IN (1);

      DELETE FROM um_Role_Permission WHERE Role_ID IN (1);
    `);
  }
}
