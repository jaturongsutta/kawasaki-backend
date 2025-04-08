import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStoreProcedure1726138099149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE FUNCTION [dbo].[fn_um_get_Username]    
      (   
        @User_CD int   
      )   
      RETURNS nvarchar(20)   
      AS   
      BEGIN   
        DECLARE @Return_Value nvarchar(20) = '-'   
        SELECT @Return_Value = Username   
        FROM um_User   
        WHERE [User_ID]  = @User_CD   
        RETURN @Return_Value   
      END;  `);

    await queryRunner.query(` CREATE FUNCTION [dbo].[fn_co_get_Predefine]    
      (   
        @Predefine_Group nvarchar(20),   
        @Predefine_CD  nvarchar(20),   
        @Language   nvarchar(10)   
      )   
      RETURNS nvarchar(300)   
      AS   
      BEGIN   
        DECLARE @Return_Value nvarchar(300) = '-'   
        SELECT @Return_Value = CASE WHEN @Language = 'EN' then isnull(Value_EN,'') else isnull(Value_TH,'') END   
        FROM co_Predefine   
        WHERE Predefine_Group = @Predefine_Group   
          AND Predefine_CD = @Predefine_CD   
        RETURN @Return_Value   
      END; `);

    await queryRunner.query(`CREATE PROCEDURE [dbo].[sp_um_Search_User]
      (
        @User_Name nvarchar(255),
        @First_Name nvarchar(255),
        @Last_Name nvarchar(255),
        @Status char(1),
        @Row_No_From  INT,
        @Row_No_To   INT
      )
      AS
      BEGIN
        SET NOCOUNT ON;
        CREATE TABLE #Temp_Result
        (
          Row_Num int,
          USER_ID int,
          Username nvarchar(255),
          First_Name nvarchar(255),
          Last_Name nvarchar(255),
          Position_Name nvarchar(255),
          Status nvarchar(1),
          Created_By nvarchar(255),
          Created_Date Datetime
        )
        INSERT INTO #Temp_Result
        SELECT ROW_NUMBER() OVER (ORDER by USER_ID, Username,First_Name) as Row_Num,
          x.*
        FROM ( 
          SELECT USER_ID, Username, First_Name, Last_Name, Position_Name, Is_Active, dbo.fn_um_get_Username(Created_By) Created_By , Created_Date
          FROM um_User
          WHERE 1=1
            AND (Username like '%' + isnull(@User_Name,'') + '%' or isnull(@User_Name,'') = '')
            AND (First_Name like '%' + isnull(@First_Name,'') + '%' or isnull(@First_Name,'') = '')
            AND (Last_Name like '%' + isnull(@Last_Name,'') + '%' or isnull(@Last_Name,'') = '')
            AND (Is_Active = isnull(@Status,'') OR isnull(@Status,'') = '')  
        ) x
        SELECT *
        FROM #Temp_Result t
        WHERE t.Row_Num between @Row_No_From and @Row_No_To
        SELECT COUNT(*) Total_Record
        FROM #Temp_Result
        DROP TABLE #Temp_Result
      END; `);

    await queryRunner.query(` CREATE PROCEDURE [dbo].[sp_um_Search_Role_Permission]
      @Role_ID INT
      AS
      BEGIN
        SET NOCOUNT ON;
        DECLARE @Default_Role_ID INT =1;
        IF @Role_ID <> 0  
        BEGIN
          SELECT @Role_ID 'Role_ID', MN.Is_MainMenu , mn.Menu_Group, MN.Menu_No, MN.Menu_Name_EN 
            , CASE WHEN RP.Can_Add = 'Y' THEN 'Y' ELSE 'N' END Can_Add 
            , CASE WHEN RP.Can_Update = 'Y' THEN 'Y' ELSE 'N' END Can_Update 
            , CASE WHEN RP.Can_View = 'Y' THEN 'Y' ELSE 'N' END Can_View 
          FROM (SELECT DISTINCT Menu_No, Menu_Name_EN, Is_MainMenu, Menu_Group
            FROM um_Menu
            WHERE Is_Active = 'Y') MN
            LEFT JOIN
            (SELECT *
            FROM um_Role_Permission
            WHERE (Role_ID = isnull(@Role_ID,'') OR isnull(@Role_ID,'') = '')) RP ON MN.Menu_No = RP.Menu_No
        END 
        ELSE 
        BEGIN
          SELECT MN.Is_MainMenu , mn.Menu_Group, MN.Menu_No, MN.Menu_Name_EN 
            , CASE WHEN RP.Can_Add = 'Y' THEN 'Y' ELSE 'N' END Can_Add 
            , CASE WHEN RP.Can_Update = 'Y' THEN 'Y' ELSE 'N' END Can_Update 
            , CASE WHEN RP.Can_View = 'Y' THEN 'Y' ELSE 'N' END Can_View 
          FROM (SELECT DISTINCT Menu_No, Menu_Name_EN, Is_MainMenu, Menu_Group
            FROM um_Menu
            WHERE Is_Active = 'Y') MN
            LEFT JOIN
            (SELECT *
            FROM um_Role_Permission
            WHERE (Role_ID = isnull(@Default_Role_ID,'') OR isnull(@Default_Role_ID,'') = '')) RP ON MN.Menu_No = RP.Menu_No
        END
      END; `);

    await queryRunner.query(`
      CREATE PROCEDURE [dbo].[sp_co_Search_Predefine]
      (
        @Predefine_Group nvarchar(20),
        @Predefine_CD nvarchar(20),
        @Value_TH nvarchar(300),
        @Value_EN nvarchar(300),
        @Is_Active char(1),
        @Language nvarchar(10),
        @Row_No_From int,
        @Row_No_To int
      )
      AS
      BEGIN
        SET NOCOUNT ON;
        CREATE TABLE #Temp_Result
        (
          Row_Num int,
          Predefine_Group nvarchar(20) collate Thai_CI_AS,
          Predefine_CD nvarchar(20) collate Thai_CI_AS,
          Value_TH nvarchar(300) collate Thai_CI_AS,
          Value_EN nvarchar(300) collate Thai_CI_AS,
          Description nvarchar(300) collate Thai_CI_AS,
          Status_Name nvarchar(50) collate Thai_CI_AS,
          Created_By nvarchar(20) collate Thai_CI_AS,
          CreateDate datetime,
          Updated_By nvarchar(20) collate Thai_CI_AS,
          Updated_Date datetime
        )
        INSERT INTO #Temp_Result
        SELECT ROW_NUMBER() OVER (ORDER BY  p.Predefine_Group, p.Predefine_CD ) AS Row_Num,
          p.Predefine_Group, p.Predefine_CD, p.Value_TH, p.Value_EN,
          p.Description,
          CASE WHEN @Language = 'EN' THEN s.Value_EN 
            ELSE s.Value_TH END Status_Name,
          dbo.fn_um_get_Username(p.Created_By) Created_By, p.Created_Date ,
          dbo.fn_um_get_Username(p.Updated_By) Updated_By , p.Updated_Date
        FROM co_Predefine p
          left outer join co_Predefine s
          on s.Predefine_Group = 'Is_Active'
            and p.Is_Active = s.Predefine_CD
        WHERE (p.Predefine_Group like '%' + @Predefine_Group + '%' or @Predefine_Group is null)
          and (p.Predefine_CD like '%' + @Predefine_CD + '%' or @Predefine_CD is null)
          and (p.Value_TH like '%' + @Value_TH + '%' or @Value_TH is null)
          and (p.Value_EN like '%' + @Value_EN + '%' or @Value_EN is null)
          and (p.Is_Active = @Is_Active or @Is_Active is null)
        SELECT *
        FROM #Temp_Result t
        WHERE t.Row_Num between @Row_No_From and @Row_No_To
        SELECT COUNT(*) Total_Record
        FROM #Temp_Result
        DROP TABLE #Temp_Result
      END  `);

    await queryRunner.query(`
      CREATE PROCEDURE [dbo].[sp_um_Load_Role_Permission]
      (
        @Role_ID int,
        @Language varchar(2)
      )
      AS
      BEGIN
        SET NOCOUNT ON;
        SELECT Menu_No
          , Menu_Name
          , MAX (Can_Add) AS Can_Add
          , MAX (Can_Update) AS Can_Update
          , MAX (Can_View) AS Can_View
        FROM (
          SELECT mn.Menu_No
            , CASE WHEN @Language = 'EN'
              THEN mn.Menu_Name_EN
              ELSE mn.Menu_Name_TH
            END AS Menu_Name
            , 'N' as Can_Add
            , 'N' as Can_Update
            , 'N' as Can_View
          FROM um_Menu mn
          UNION
          SELECT mn.Menu_No
            , CASE WHEN @Language = 'EN'
              THEN mn.Menu_Name_EN
              ELSE mn.Menu_Name_TH
            END AS Menu_Name
            , ISNULL(rup.Can_Add,'N') AS Can_Add
            , ISNULL(rup.Can_Update,'N') AS Can_Update
            , ISNULL(rup.Can_View,'N') AS Can_View
          FROM UM_Menu mn
            LEFT OUTER JOIN UM_Role_Permission rup
            ON mn.Menu_No = rup.Menu_No
          WHERE rup.Role_ID = @Role_ID
        ) Tab
        GROUP BY Menu_No, Menu_Name
        ORDER BY Menu_No
      END`);

    await queryRunner.query(`
      
      CREATE PROCEDURE [dbo].[sp_um_User_Role_Permission]
      (
        @User_ID INT,
        @Language VARCHAR(10) = 'EN',
        @Return_CD VARCHAR (20) out
      )
      AS
      BEGIN
        DECLARE @Role_Name as VARCHAR(255), @CountUserID INT = 0, @User_Name as VARCHAR(255);
        SET NOCOUNT ON;
        Set @Role_Name = (SELECT STRING_AGG(role_name_en,',')
        FROM (SELECT r.role_name_en
          FROM um_User_Role ur INNER JOIN um_Role r ON ur.role_id = r.role_id
          WHERE ur.user_id = @User_ID)RN)
        BEGIN TRY 
          SELECT @CountUserID = count(User_ID)
          FROM um_User
          WHERE Is_Active = 'Y'
            AND User_ID = @User_ID 
          SELECT @User_Name = UserName
          FROM um_User
          WHERE is_active = 'Y'
            AND User_ID = @User_ID 
          SELECT *
          FROM (             
            SELECT us.UserName,
              @Role_Name as In_Role,
              mn.Menu_No,
              CASE WHEN @Language = 'EN' 
                THEN mn.Menu_Name_EN     
                ELSE mn.Menu_Name_TH     
              END AS Menu_Name,
              mn.Menu_Group,
              mn.URL,
              Menu_Seq,
              mn.Menu_Icon,
              CASE WHEN Is_MainMenu = 'Y'  
                THEN 'Main Menu'     
                ELSE '-Sub Menu' 
              END AS IS_MainMenu,
              case when sum(case when rm.Can_Add='Y' then 1 else 0 end) = 0 then 'N' else 'Y' end Can_Add,
              case when sum(case when rm.Can_Update='Y' then 1 else 0 end) = 0 then 'N' else 'Y' end Can_Update,
              case when sum(case when rm.Can_View='Y' then 1 else 0 end) = 0 then 'N' else 'Y' end Can_View
            FROM um_User_Role ur
              JOIN um_Role_Permission   rm on ur.Role_ID = rm.Role_ID
              JOIN um_Menu mn ON mn.Menu_No = rm.Menu_No
              JOIN um_User us ON ur.User_ID = us.User_ID
            WHERE mn.Is_Active = 'Y'
              AND ur.User_ID = @User_ID
              AND rm.Can_View = 'Y'
            group by us.UserName, 
              mn.Menu_No,     
              CASE WHEN @Language = 'EN' 
                THEN mn.Menu_Name_EN     
                ELSE mn.Menu_Name_TH     
              END , 
              mn.Menu_Group,     
              mn.URL,     
              Menu_Seq,   
              CASE WHEN Is_MainMenu = 'Y'  
                THEN 'Main Menu'     
                ELSE '-Sub Menu' 
              END
            UNION
            SELECT DISTINCT @User_Name, @Role_Name as In_Role,
              mn.Menu_No,
              CASE WHEN @Language = 'EN' 
                THEN mn.Menu_Name_EN     
                ELSE mn.Menu_Name_TH     
              END AS Menu_Name,
              Menu_Group,
              URL,
              0 Menu_Seq,
              'Main Menu' IS_MainMenu,
              'N' Can_Add,
              'N' Can_Update,
              'Y' Can_View
            FROM um_Menu mn
            WHERE 0=0
              AND mn.Menu_No in( 
                SELECT DISTINCT mn.Menu_Group
                FROM um_User_Role ur
                  JOIN um_Role_Permission rm on ur.Role_ID = rm.Role_ID
                  JOIN um_Menu mn ON mn.Menu_No = rm.Menu_No
                  JOIN um_User us ON ur.User_ID = us.User_ID
                WHERE mn.Is_Active = 'Y'
                  AND ur.User_ID = @User_ID
                  AND rm.Can_View = 'Y' 
              )
          ) X
          ORDER BY Menu_No 
        END TRY 
        BEGIN CATCH 
          SET @Return_CD = CAST(ERROR_NUMBER() AS VARCHAR(10)); 
          PRINT 'Actual error number: ' + @Return_CD; 
          THROW; 
        END CATCH
      END `);

    await queryRunner.query(` 
      
      CREATE PROCEDURE [dbo].[sp_um_Search_Role]
      (
        @Role_Name_EN nvarchar(255),
        @Role_Name_TH nvarchar(255),
        @Status char(1),
        @Row_No_From  int,
        @Row_No_To   int
      )
      AS
      BEGIN
        SET NOCOUNT ON;
        CREATE TABLE #Temp_Result
        (
          Row_Num int,
          Role_ID int,
          Role_Name_EN nvarchar(255),
          Role_Name_TH nvarchar(255),
          Status nvarchar(1),
          Created_By nvarchar(255),
          Created_Date Datetime ,
          Updated_By nvarchar(255),
          Updated_Date Datetime
        )
        INSERT INTO #Temp_Result
        SELECT ROW_NUMBER() OVER (ORDER BY  Role_ID, Role_Name_EN ) AS Row_Num 
          , Role_ID, Role_Name_EN, Role_Name_TH, Is_Active, dbo.fn_um_get_Username(Created_By) Created_By , Created_Date
          , dbo.fn_um_get_Username(Updated_By) Updated_By, Updated_Date
        FROM um_Role
        WHERE 1=1
          AND (Role_Name_EN like '%' + isnull(@Role_Name_EN,'') + '%' or isnull(@Role_Name_EN,'') = '')
          AND (Role_Name_TH like '%' + isnull(@Role_Name_TH,'') + '%' or isnull(@Role_Name_TH,'') = '')
          AND (Is_Active = isnull(@Status,'') OR isnull(@Status,'') = '')
        SELECT *
        FROM #Temp_Result t
        WHERE t.Row_Num between @Row_No_From and @Row_No_To
        SELECT COUNT(*) Total_Record
        FROM #Temp_Result
        DROP TABLE #Temp_Result
      END  `);

    await queryRunner.query(` 
      CREATE PROCEDURE [dbo].[sp_um_Search_Menu]
      (
        @Menu_No NVARCHAR(5),
        @Menu_Name NVARCHAR(100),
        @Status CHAR(1),
        @Language VARCHAR(2)
      )
      AS
      BEGIN
        SET NOCOUNT ON;
        SELECT
          mn.Menu_No,
          mn.Menu_Name_TH,
          mn.Menu_Name_EN,
          mn.Menu_Seq,
          mn.URL,
          mn.Menu_Group,
          dbo.fn_co_get_Predefine('Is_Active', mn.Is_Active, @Language) AS Status,
          dbo.fn_um_get_Username(mn.Created_By) AS Created_By,
          CONVERT(VARCHAR, mn.Created_Date, 103) AS Created_Date_Display,
          dbo.fn_um_get_Username(mn.Updated_by) AS Updated_By,
          CONVERT(VARCHAR, mn.Updated_Date, 103) AS Updated_Date_Display,
          mn.Created_By,
          mn.Updated_Date,
          mn.Is_Active
        FROM um_menu mn
        WHERE 
          (mn.Menu_No LIKE '%' + ISNULL(@Menu_No, '') + '%' OR ISNULL(@Menu_No, '') = '')
          AND (mn.Menu_Name_TH LIKE '%' + ISNULL(@Menu_Name, '') + '%' OR mn.Menu_Name_EN LIKE '%' + ISNULL(@Menu_Name, '') + '%' OR ISNULL(@Menu_Name, '') = '')
          AND (mn.Is_Active = ISNULL(@Status, '') OR ISNULL(@Status, '') = '')
        ORDER BY Menu_No;
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP PROCEDURE [dbo].[sp_um_Search_Menu];
      DROP PROCEDURE [dbo].[sp_um_Search_Role];
      DROP PROCEDURE [dbo].[sp_um_User_Role_Permission];
      DROP PROCEDURE [dbo].[sp_um_Load_Role_Permission];
      DROP PROCEDURE [dbo].[sp_co_Search_Predefine];
      DROP PROCEDURE [dbo].[sp_um_Search_Role_Permission];
      DROP PROCEDURE [dbo].[sp_um_Search_User];
      DROP FUNCTION [dbo].[fn_co_get_Predefine];
      DROP FUNCTION [dbo].[fn_um_get_Username];
    `);
  }
}
