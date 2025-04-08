import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoleData1726025309311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

        SET IDENTITY_INSERT um_Role ON;

      INSERT INTO um_Role (Role_ID, Role_Name_TH, Role_Name_EN, Is_Active, Created_By, Created_Date, Updated_By, Updated_Date)
      VALUES 
        (1, 'ผู้ดูแลระบบ', 'Administrator', 'Y', 1, GETDATE(), 1, GETDATE()),
        (2, 'ผู้ใช้งานทั่วไป', 'User', 'Y', 1, GETDATE(), 1, GETDATE());


         SET IDENTITY_INSERT um_Role OFF;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM um_Role WHERE Role_ID IN (1, 2);
    `);
  }
}
