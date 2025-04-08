import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPredefineData1726026802492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO co_Predefine (Predefine_Group, Predefine_CD, Description, Value_TH, Value_EN, Is_Active, Created_By, Created_Date, Updated_By, Updated_Date)
      VALUES 
      ('ConfigPath', 'LOG', 'Log path', './logs', './logs', 'Y', 1, '2567-09-24 07:50:08.237', NULL, '2567-09-24 07:50:08.237'),
      ('Is_Active', 'N', '', 'Inactive', 'ไม่ใช้งาน', 'Y', 1, '2567-09-13 05:45:44.687', NULL, '2567-09-13 05:45:44.687'),
      ('Is_Active', 'Y', '', 'Active', 'ใช้งาน', 'Y', 1, '2567-09-13 03:44:58.587', 1, '2567-09-13 03:44:58.587');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM co_Predefine WHERE Predefine_Group IN ('ConfigPath', 'Is_Active') AND Predefine_CD IN ('LOG', 'N', 'Y');
    `);
  }
}
